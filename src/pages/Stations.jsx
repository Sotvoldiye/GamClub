import { useEffect, useState } from 'react';
import useStationed from '../hooks/Stationsed';
import Modal from '../components/Modal';

function Stations() {
  const [malumot, setMalumot] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [shouldStart, setShouldStart] = useState(false); // Modaldan keyin start bosilishi uchun

  useEffect(() => {
    const data = localStorage.getItem("malumot");
    if (data) {
      setMalumot(JSON.parse(data));
    }
  }, []);

  const {
    elapsed,
    isRunning,
    isPaused,
    handleStart,
    handlePause,
    handleReset,
    formatTime,
    calculateMoney,
  } = useStationed(selectedStation); // <-- STATION ID yuboramiz

  const handleModalClose = () => {
    setSelectedStation(null);
  };

  const handleModalSubmit = (formData) => {
    // formData: { name, duration, etc. }
    handleStart(formData);  // <- handleStart ga ma'lumot yuboriladi
    setSelectedStation(null); // Modal yopiladi
  };

  return (
    <div className="container">
      <div className="stations relative">
        {malumot.map((item) => (
          <div key={item.name}>
            <div className="station-card">
              <h3>{item.name}</h3>
              <p>{item.versiya}</p>
              <p className="status">
                {isRunning ? (isPaused ? 'Paused' : 'Active') : 'Inactive'}
              </p>
              <p className="timer">{formatTime(elapsed)}</p>
              <p>{calculateMoney(elapsed)} so'm</p>

              <button onClick={() => setSelectedStation(item.name)}>
                Start Session
              </button>

              {isRunning && (
                <button onClick={handlePause}>
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              )}
              <button onClick={handleReset}>Reset</button>
            </div>

            {selectedStation === item.name && (
              <Modal
                closeModal={handleModalClose}
                onSubmit={handleModalSubmit} // <-- yangi funksiya
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stations;
