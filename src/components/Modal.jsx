import { useState } from 'react';

function Modal({ closeModal, onSubmit }) {
  const [userName, setUserName] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ userName, duration }); // Station.jsx ga yuboriladi
  };

  return (
    <div className=" modal-overlay">
      <form className='modal-container' onSubmit={handleSubmit}>
        <label>
          Ism:{" "}
        </label>
        <input value={userName} onChange={(e) => setUserName(e.target.value)} />
    <br />
        <label>
          Vaqt:{" "}
        </label>
        <input value={duration} onChange={(e) => setDuration(e.target.value)} />

        <button type="submit">Boshlash</button>
        <button onClick={closeModal}>Bekor qilish</button>
      </form>
    </div>
  );
}

export default Modal;
