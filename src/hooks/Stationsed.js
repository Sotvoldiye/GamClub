import { useEffect, useState } from 'react';

function useStationed(id) {
  const [elapsed, setElapsed] = useState(0);      
  const [isRunning, setIsRunning] = useState(false);  

  const prefix = `station_${id}_`;

  useEffect(() => {
    const savedStart = localStorage.getItem(prefix + 'timer_start');
    const savedElapsed = parseInt(localStorage.getItem(prefix + 'timer_elapsed')) || 0;
    const savedRunning = localStorage.getItem(prefix + 'timer_running') === 'true';

    if (savedStart && savedRunning) {
      const now = Date.now();
      const start = parseInt(savedStart, 10);
      const diffInSeconds = Math.floor((now - start) / 1000);
      setElapsed(savedElapsed + diffInSeconds);
      setIsRunning(true);
    } else {
      setElapsed(savedElapsed);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if (!isRunning) {
      const prevElapsed = parseInt(localStorage.getItem(prefix + 'timer_elapsed')) || 0;
      localStorage.setItem(prefix + 'timer_start', Date.now().toString());
      localStorage.setItem(prefix + 'timer_elapsed', prevElapsed.toString());
      localStorage.setItem(prefix + 'timer_running', 'true');
      setIsRunning(true);
    }
  };

   const handleReset = () => {
    localStorage.removeItem(prefix + 'timer_start');
    localStorage.removeItem(prefix + 'timer_elapsed');
    localStorage.removeItem(prefix + 'timer_running');
    setElapsed(0);
    setIsRunning(false);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const calculateMoney = (seconds) => {
    const amount = (seconds / 60) * 500;
    return amount.toFixed(2);
  };

  return {
    elapsed,
    isRunning,
    handleStart,
    handleReset,
    formatTime,
    calculateMoney,
  };
}

export default useStationed;
