import React, { useEffect, useState } from 'react';

function  SessionHistory() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('sessions');
    if (data) {
      setSessions(JSON.parse(data));
    }
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Saqlangan User va malumotlar</h2>
      {sessions.length === 0 ? (
        <p>Hozircha hech qanday sessiya yo‘q.</p>
      ) : (
        <div className="overflow-x-auto mt-4">
 <div className="w-full overflow-x-auto mt-4">
  <table className="table w-full border border-green-300">
    <thead className="bg-green-100 text-green-800">
      <tr>
        <th className="px-4 py-2">#</th>
        <th className="px-4 py-2">Ism</th>
        <th className="px-4 py-2">Vaqt (minut)</th>
      </tr>
    </thead>
    <tbody className="bg-white text-gray-700">
      {sessions.map((session, index) => (
        <tr key={index} className="hover:bg-green-50 transition">
          <th className="border-t px-4 py-2">{index + 1}</th>
          <td className="border-t px-4 py-2">{session.name}</td>
          <td className="border-t px-4 py-2">{session.vaqt}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>

      
      
      )}
    </div>
  );
}

export default  SessionHistory;
  