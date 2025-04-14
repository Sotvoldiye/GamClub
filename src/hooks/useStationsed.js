import { useEffect, useState, useRef } from 'react';

function useStationed(id, sessionTimeInMinutes = 0) {
  const [remaining, setRemaining] = useState(sessionTimeInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const prefix = `station_${id}_`;

  useEffect(() => {
    const savedTime = parseInt(localStorage.getItem(prefix + 'remaining')) || (sessionTimeInMinutes * 60);
    const savedRunning = localStorage.getItem(prefix + 'running') === 'true';
    const savedPaused = localStorage.getItem(prefix + 'paused') === 'true';

    setRemaining(savedTime);
    setIsRunning(savedRunning);
    setIsPaused(savedPaused);

    if (savedRunning && !savedPaused) {
      startInterval();
    }

    return () => clearInterval(intervalRef.current);
  }, []);

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          localStorage.setItem(prefix + 'running', 'false');
          return 0;
        }
        const updated = prev - 1;
        localStorage.setItem(prefix + 'remaining', updated);
        return updated;
      });
    }, 1000);
  };

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      localStorage.setItem(prefix + 'running', 'true');
      localStorage.setItem(prefix + 'paused', 'false');
      localStorage.setItem(prefix + 'remaining', remaining);
      startInterval();
    }
  };

  const handlePause = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsPaused(true);
      setIsRunning(false);
      localStorage.setItem(prefix + 'paused', 'true');
      localStorage.setItem(prefix + 'running', 'false');
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    const resetValue = sessionTimeInMinutes * 60;
    setRemaining(resetValue);
    setIsRunning(false);
    setIsPaused(false);
    localStorage.setItem(prefix + 'remaining', resetValue);
    localStorage.setItem(prefix + 'running', 'false');
    localStorage.setItem(prefix + 'paused', 'false');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return {
    remaining,
    isRunning,
    isPaused,
    handleStart,
    handlePause,
    handleReset,
    formatTime
  };
}

export default useStationed;
