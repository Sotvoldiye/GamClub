import React, { useState, useEffect } from 'react';

function SessionHistory() {
  const [sessionHistory, setSessionHistory] = useState(() => {
    const saved = localStorage.getItem("sessions");
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error parsing sessions from localStorage:", e);
      return [];
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem("sessions");
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      setSessionHistory(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error("Error parsing sessions from localStorage:", e);
      setSessionHistory([]);
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("sessions");
    setSessionHistory([]);
  };

  const formatMinutes = (vaqt) => {
    const minutes = Math.floor(vaqt);
    const seconds = Math.floor((vaqt - minutes) * 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-green-400">Malumotlar Tarixi</h2>
        {sessionHistory.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Tarixni Tozalash
          </button>
        )}
      </div>

      {sessionHistory.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-400 font-medium">
            Hozircha malumot;ar yo‘q.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider rounded-tl-lg">
                  Foydalanuvchi
                </th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
                  O‘ynagan vaqti (minut)
                </th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider rounded-tr-lg">
                  To‘langan summa (so‘m)
                </th>
              </tr>
            </thead>
            <tbody>
              {sessionHistory.map((session, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-green-300 font-medium">
                    {session.name || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-200">
                    {formatMinutes(session.vaqt)}
                  </td>
                  <td className="px-6 py-4 text-gray-200">
                    {(session.price != null ? session.price : 0).toLocaleString('uz-UZ', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SessionHistory;
