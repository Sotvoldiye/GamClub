import React, { useState } from 'react';
import FormInput from './FormInput';

function Modal({ closeModal, onSubmit }) {
  const [button, setButton] = useState(''); // 'vaqt' or 'summa'
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    setButton(value === 'other' ? 'vaqt' : ''); // Default to vaqt for 'other'
  };

  const handleInputToggle = (type) => {
    setButton(type); // Switch between 'vaqt' and 'summa'
  };

  const formFunck = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userName = formData.get("userName");
    const option = selectedOption;
    let vaqt = 0;
    let summa = null;

    if (option === 'vip') {
      vaqt = 0;
    } else if (option === 'other') {
      if (button === 'vaqt') {
        vaqt = Number(formData.get("vaqt")) || 0;
      } else if (button === 'summa') {
        summa = Number(formData.get("summa")) || 0;
      }
    }

    onSubmit({ userName, vaqt, summa, option });
    e.target.reset();
    setSelectedOption('');
    setButton('');
    closeModal();
  };

  return (
    <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="modal-container bg-white p-6 rounded shadow-lg w-[400px]">
        <form onSubmit={formFunck}>
          <FormInput name="userName" label="Foydalanuvchi Ismi" type="text" />

          <select
            id="deviceSelect"
            className="p-2 border rounded w-full mb-3"
            value={selectedOption}
            onChange={handleChange}
            required
          >
            <option value="">Tanlang</option>
            <option value="vip">Vipni yoqish</option>
            <option value="other">Oddiy sessiya</option>
          </select>

          {selectedOption === 'other' && (
            <div className="mb-3">
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  className={`px-3 py-1 rounded ${button === 'vaqt' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleInputToggle('vaqt')}
                >
                  Vaqt
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded ${button === 'summa' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleInputToggle('summa')}
                >
                  Summa
                </button>
              </div>
              {button === 'vaqt' && (
                <FormInput type="number" label="Vaqtni belgilang (minut)" name="vaqt" min="1" />
              )}
              {button === 'summa' && (
                <FormInput type="number" label="Summani kiriting (so‘m)" name="summa" min="0" />
              )}
            </div>
          )}

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