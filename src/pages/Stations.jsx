import { useEffect, useState } from 'react';
import useStationed from '../hooks/Stationsed';
import Modal from '../components/Modal';

function Stations() {
  const [malumot, setMalumot] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null); 

  useEffect(() => {
    const data = localStorage.getItem("malumot");
    if (data) {
      setMalumot(JSON.parse(data));
    }
  }, []);

  const { calculateMoney, formatTime, handleReset, handleStart, elapsed } = useStationed();

  const handleModalClose = (e) => {
    e.preventDefault()
    setSelectedStation(null); 
  };

  return (
    <div className="container ">
      <div className="stations relative">
        {malumot.map((item, index) => (
         <div  key={item.name}>
           <div className="station-card">
            <h3>{item.name}</h3>
            <p>{item.versiya}</p>
            <p className="status inactive">Inactive</p>
            <p className="timer">{formatTime(elapsed)}</p>
            <p>{calculateMoney(elapsed)} so'm</p>
            <button onClick={() => setSelectedStation(item.name)}>Start Session</button>
            <button onClick={handleReset}>Reset</button>
          </div>
        <div className='relative'>
        {selectedStation === item.name && <Modal closeModal={handleModalClose} />}
        </div>
         </div>        ))}
      </div>
    </div>
  );
}

export default Stations;
