import React from 'react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { useStationed } from '../hooks/useStationsed';
useStationed

function Stations() {
  const {
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
  } = useStationed();

  return (
    <div className="container">
      <div className="stations relative grid grid-cols-3 gap-4">
        {malumot.map((item, index) => {
          const sessionData = sessions[item.name];

          return (
            <div key={item.name} className="station-card bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p>{item.versiya}</p>
              <p className="status text-sm text-gray-600">
                {sessionData?.start ? 'Active' : 'Inactive'}
              </p>
              <p className="text-gray-400 font-semibold">
                Foydalanuvchi: {sessionData?.userName || '—'}
              </p>
              <p>Vaqt: {sessionData ? formatMinutes(sessionData.vaqt || 0) : '00:00'}</p>
              <p className="text-gray-400">Narx (soatiga): {item.number} so'm</p>
              <p className="text-gray-400">
                Hisob: {sessionData ? calculatePrice(item.name, sessionData) + ' so‘m' : '0 so‘m'}
              </p>
              {sessionData && sessionData.summa !== null && (
                <p className="text-gray-400">
                  Qoldiq summa: {(sessionData.remainingSumma || 0).toFixed(2)} so‘m
                </p>
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

    </div>
  );
}

export default Stations;