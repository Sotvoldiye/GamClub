import { useEffect, useState } from 'react';

export function useStationed() {
  const [malumot, setMalumot] = useState(() => {
    const data = localStorage.getItem("malumot");
    return data ? JSON.parse(data) : [];
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("activeSessions");
    try {
      const parsed = saved ? JSON.parse(saved) : {};
      return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (e) {
      console.error("Error parsing activeSessions from localStorage:", e);
      return {};
    }
  });

  const [selectedStation, setSelectedStation] = useState(null);
  const [editStationIndex, setEditStationIndex] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', versiya: '', number: '' });

  // Load malumot from localStorage
  useEffect(() => {
    const data = localStorage.getItem("malumot");
    if (data) {
      setMalumot(JSON.parse(data));
    }
  }, []);

  // Sync sessions state with localStorage
  useEffect(() => {
    localStorage.setItem("activeSessions", JSON.stringify(sessions));
  }, [sessions]);

  // Sync malumot with localStorage
  useEffect(() => {
    localStorage.setItem("malumot", JSON.stringify(malumot));
  }, [malumot]);

  // Timer for updating session times
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) => {
        const updated = { ...prev };
        Object.entries(prev).forEach(([key, val]) => {
          if (val.start) {
            if (val.option === 'vip') {
              updated[key].vaqt = (updated[key].vaqt || 0) + 1 / 60;
              updated[key].consumedTime = updated[key].vaqt;
            } else if (val.vaqt > 0) {
              updated[key].vaqt -= 1 / 60;
              updated[key].consumedTime = (updated[key].consumedTime || 0) + 1 / 60;
              if (val.summa !== null) {
                updated[key].remainingSumma = Math.max(
                  0,
                  (updated[key].remainingSumma || val.summa) - (val.pricePerHour / 3600)
                );
              }
              if (updated[key].vaqt <= 0 || (val.summa !== null && updated[key].remainingSumma <= 0)) {
                updated[key].vaqt = 0;
                updated[key].remainingSumma = 0;
                updated[key].start = false;
              }
            }
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPricePerHour = (stationName) => {
    const comps = JSON.parse(localStorage.getItem("malumot")) || [];
    const comp = comps.find((m) => m.name === stationName);
    return comp && comp.number ? comp.number : 0;
  };

  const handleStartClick = (stationName) => {
    setSelectedStation(stationName);
  };

  const handleModalClose = () => {
    setSelectedStation(null);
  };

  const handleModalSubmit = (stationName, data) => {
    console.log("Modal submit data:", { stationName, data });
    const pricePerHour = getPricePerHour(stationName);
    const newSession = {
      ...data,
      start: true,
      pricePerHour,
    };

    if (data.option === 'vip') {
      newSession.vaqt = 0;
      newSession.consumedTime = 0;
      newSession.aslVaqt = null;
      newSession.summa = null;
      newSession.remainingSumma = null;
    } else {
      newSession.consumedTime = 0;
      if (data.summa !== null && data.summa > 0 && pricePerHour > 0) {
        newSession.vaqt = (data.summa / pricePerHour) * 60;
        newSession.aslVaqt = newSession.vaqt;
        newSession.summa = data.summa;
        newSession.remainingSumma = data.summa;
      } else {
        newSession.vaqt = parseFloat(data.vaqt) || 60;
        newSession.aslVaqt = newSession.vaqt;
        newSession.summa = null;
        newSession.remainingSumma = null;
      }
    }

    setSessions((prev) => ({
      ...prev,
      [stationName]: newSession,
    }));
    setSelectedStation(null);
  };

  const togglePause = (stationName) => {
    setSessions((prev) => ({
      ...prev,
      [stationName]: {
        ...prev[stationName],
        start: !prev[stationName].start,
      },
    }));
  };

  const calculatePrice = (stationName, session) => {
    const pricePerHour = session.pricePerHour || getPricePerHour(stationName);
    const timeInHours = (session.consumedTime || 0) / 60;
    let price = parseFloat((timeInHours * pricePerHour).toFixed(2));
    if (session.summa !== null) {
      price = Math.min(price, session.summa);
    }
    return price;
  };

  const handleFinish = (stationName) => {
    const session = sessions[stationName];
    if (!session) return;

    const price = calculatePrice(stationName, session);

    const oldHistory = localStorage.getItem('sessions');
    let history = [];
    if (oldHistory) {
      try {
        history = JSON.parse(oldHistory);
        if (!Array.isArray(history)) {
          history = [];
        }
      } catch (e) {
        console.error("Error parsing sessions from localStorage:", e);
        history = [];
      }
    }

    const newEntry = {
      name: session.userName,
      vaqt: session.option === 'vip' ? session.vaqt.toFixed(2) : (session.aslVaqt || 0),
      price: price,
      summa: session.summa !== null ? session.summa : null,
    };

    history.push(newEntry);
    localStorage.setItem('sessions', JSON.stringify(history));

    setSessions((prev) => {
      const updated = { ...prev };
      delete updated[stationName];
      return updated;
    });
  };

  const formatMinutes = (vaqt) => {
    const minutes = Math.floor(vaqt);
    const seconds = Math.floor((vaqt - minutes) * 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // O‘chirish funksiyasi
  const handleDeleteClick = (stationName, index) => {
    if (window.confirm(`${stationName} stansiyasini o‘chirishni tasdiqlaysizmi?`)) {
      const updatedMalumot = malumot.filter((_, i) => i !== index);
      setMalumot(updatedMalumot);

      if (sessions[stationName]) {
        const updatedSessions = { ...sessions };
        delete updatedSessions[stationName];
        setSessions(updatedSessions);
        localStorage.setItem("activeSessions", JSON.stringify(updatedSessions));
      }
    }
  };

  return {
    malumot,
    sessions,
    selectedStation,
    handleDeleteClick,
    handleFinish,
    handleStartClick,
    formatMinutes,
    togglePause,
    handleModalClose,
    handleModalSubmit,
    calculatePrice,
  };
}