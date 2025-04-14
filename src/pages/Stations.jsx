import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';

function Stations() {
  const [malumot, setMalumot] = useState(() => {
    const data = localStorage.getItem("malumot");
    return data ? JSON.parse(data) : [];
  });
  const [selectedStation, setSelectedStation] = useState(null);
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

  const calculateTotalPrice = () => {
    let total = 0;
    Object.entries(sessions).forEach(([stationName, session]) => {
      total += calculatePrice(stationName, session);
    });
    return parseFloat(total.toFixed(2));
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

  // Tahrirlash uchun funksiyalar
  const handleEditClick = (station, index) => {
    setEditStationIndex(index);
    setEditForm({
      name: station.name || '',
      versiya: station.versiya || '',
      number: station.number || 0,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedMalumot = [...malumot];
    const oldName = updatedMalumot[editStationIndex].name; // Eski nom
    updatedMalumot[editStationIndex] = {
      ...updatedMalumot[editStationIndex],
      name: editForm.name,
      versiya: editForm.versiya,
      number: editForm.number,
    };

    // Sessions ob'ektini yangilash
    if (oldName !== editForm.name && sessions[oldName]) {
      const updatedSessions = { ...sessions };
      updatedSessions[editForm.name] = updatedSessions[oldName];
      delete updatedSessions[oldName];
      setSessions(updatedSessions);
      localStorage.setItem("activeSessions", JSON.stringify(updatedSessions));
    }

    setMalumot(updatedMalumot);
    setEditStationIndex(null);
  };

  const handleEditCancel = () => {
    setEditStationIndex(null);
  };

  // O‘chirish funksiyasi
  const handleDeleteClick = (stationName, index) => {
    if (window.confirm(`${stationName} stansiyasini o‘chirishni tasdiqlaysizmi?`)) {
      const updatedMalumot = malumot.filter((_, i) => i !== index);
      setMalumot(updatedMalumot);

      // Agar stansiya bilan bog‘liq faol sessiya bo‘lsa, uni o‘chirish
      if (sessions[stationName]) {
        const updatedSessions = { ...sessions };
        delete updatedSessions[stationName];
        setSessions(updatedSessions);
        localStorage.setItem("activeSessions", JSON.stringify(updatedSessions));
      }
    }
  };

  return (
    <div className="container">
      <div className="stations relative grid grid-cols-3 gap-4">
        {malumot.map((item, index) => {
          const sessionData = sessions[item.name];

          return (
            <div key={item.name} className="station-card bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p>{item.versiya}</p>
              <p className="status text-sm text-gray-600">{sessionData?.start ? 'Active' : 'Inactive'}</p>
              <p className="text-gray-800 font-semibold">Foydalanuvchi: {sessionData?.userName || '—'}</p>
              <p>Vaqt: {sessionData ? formatMinutes(sessionData.vaqt || 0) : '00:00'}</p>
              <p className="text-gray-800">Narx (soatiga): {item.number} so'm</p>
              <p className="text-gray-800">Hisob: {sessionData ? calculatePrice(item.name, sessionData) + ' so‘m' : '0 so‘m'}</p>
              {sessionData && sessionData.summa !== null && (
                <p className="text-gray-800">Qoldiq summa: {(sessionData.remainingSumma || 0).toFixed(2)} so‘m</p>
              )}

              <div className="flex gap-2 mt-2 flex-col">
                <button
                  onClick={() => handleStartClick(item.name)}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Boshlash
                </button>

                {sessionData && (
                  <>
                    <button
                      onClick={() => togglePause(item.name)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded"
                    >
                      {sessionData.start ? 'Pause' : 'Davom ettirish'}
                    </button>
                    <button
                      onClick={() => handleFinish(item.name)}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Tugatish
                    </button>
                  </>
                )}

                {/* Tahrirlash tugmasi */}


                {/* O‘chirish tugmasi */}
                <button
                  onClick={() => handleDeleteClick(item.name, index)}
                  className="px-4 py-2 bg-red-800 text-white rounded"
                >
                  O‘chirish
                </button>
              </div>

              {selectedStation === item.name && (
                <Modal
                  closeModal={handleModalClose}
                  onSubmit={(data) => handleModalSubmit(item.name, data)}
                />
              )}
            </div>
          );
        })}
      </div>



      {/* Tahrirlash modali */}
      {editStationIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Stansiyani Tahrirlash</h3>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
              <FormInput
                label="Kompyutermi yo PS ?"
                name="name"
                type="text"
                value={editForm.name}
                onChange={handleEditChange}
              />
              <FormInput
                label="Qaysi versiya ?"
                name="versiya"
                type="text"
                value={editForm.versiya}
                onChange={handleEditChange}
              />
              <FormInput
                label="Soatiga qancha so'mda ?"
                name="number"
                type="number"
                value={editForm.number}
                onChange={handleEditChange}
              />
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stations;