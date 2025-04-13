import React, { useState } from 'react';

function Modal({ closeModal, startSession }) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Foydalanuvchi nomi va davomiylikni boshlash uchun callbackni chaqirish
    if (name && duration) {
      startSession(name, duration);
      closeModal();  // Modalni yopish
    } else {
      alert('Iltimos, barcha maydonlarni to\'ldiring.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Start Session</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Your Name:</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label htmlFor="duration">Session Duration (minutes):</label>
            <input 
              type="number" 
              id="duration" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
              required 
            />
          </div>
          <div>
            <button type="submit">Start</button>
          </div>
        </form>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
}

export default Modal;
