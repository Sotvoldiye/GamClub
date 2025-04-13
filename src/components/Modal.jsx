import React, { useState } from 'react';
import FormInput from './FormInput';

function Modal({ closeModal }) {
  const [button, setButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    setButton(value === 'other');
  };

  const formFunck = (e) => {
    const formData = new FormData(e.target);
    const userName = formData.get("userName");
    const vaqt = Number(formData.get("vaqt")) || 0;

    const newData = { name: userName, vaqt };

    const userMalumot = JSON.parse(localStorage.getItem('sessions')) || [];

    const updated = [...userMalumot, newData];

    localStorage.setItem('sessions', JSON.stringify(updated));

    console.log('Saqlangan:', updated);

    e.target.reset();
    closeModal(); 
  };

  return (
    <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="modal-container bg-green-500 p-6 rounded shadow-lg w-[400px]">
        <form onSubmit={formFunck}>
          <FormInput name="userName" label="Foydalanuvchi Ismi" type="text" />

          <select
            id="deviceSelect"
            className="p-2 border rounded w-full mb-3"
            value={selectedOption}
            onChange={handleChange}
          >
            <option value="vip">Vipni yoqish</option>
            <option value="other">Vaqtni kiriting</option>
          </select>

          {button && <FormInput type="number" label="Vaqtni belgilang" name="vaqt" />}

          <div className="flex justify-between mt-4 gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Saqlash</button>
            <button type="button" onClick={closeModal} className="bg-red-600 text-white px-4 py-2 rounded">Yopish</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
