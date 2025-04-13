import { useEffect, useState } from 'react';

function useStationed(id) {
  const [elapsed, setElapsed] = useState(0);      
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);  // Add state for pause

  const prefix = `station_${id}_`;

  useEffect(() => {
    const savedStart = localStorage.getItem(prefix + 'timer_start');
    const savedElapsed = parseInt(localStorage.getItem(prefix + 'timer_elapsed')) || 0;
    const savedRunning = localStorage.getItem(prefix + 'timer_running') === 'true';
    const savedPaused = localStorage.getItem(prefix + 'timer_paused') === 'true'; // Load paused state

    if (savedStart && savedRunning && !savedPaused) {
      const now = Date.now();
      const start = parseInt(savedStart, 10);
      const diffInSeconds = Math.floor((now - start) / 1000);
      setElapsed(savedElapsed + diffInSeconds);
      setIsRunning(true);
      setIsPaused(false);  // Ensure paused state is false when the timer is running
    } else if (savedRunning && savedPaused) {
      setIsRunning(true);
      setIsPaused(true); // If the timer was paused, set the state as paused
    } else {
      setElapsed(savedElapsed);
    }
  }, [id]);

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const handleStart = (formData) => {
    const { duration } = formData;
    const durationInSeconds = parseInt(duration) * 60;
  
    const prevElapsed = parseInt(localStorage.getItem(prefix + 'timer_elapsed')) || 0;
    localStorage.setItem(prefix + 'timer_start', Date.now().toString());
    localStorage.setItem(prefix + 'timer_duration', durationInSeconds.toString()); // yangi
    localStorage.setItem(prefix + 'timer_elapsed', prevElapsed.toString());
    localStorage.setItem(prefix + 'timer_running', 'true');
    localStorage.setItem(prefix + 'timer_paused', 'false');
    setIsRunning(true);
    setIsPaused(false);
  };
  

  const handlePause = () => {
    if (isRunning && !isPaused) {
      localStorage.setItem(prefix + 'timer_paused', 'true');
      setIsPaused(true);
    } else if (isRunning && isPaused) {
      localStorage.setItem(prefix + 'timer_paused', 'false');
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(prefix + 'timer_start');
    localStorage.removeItem(prefix + 'timer_elapsed');
    localStorage.removeItem(prefix + 'timer_running');
    localStorage.removeItem(prefix + 'timer_paused');
    setElapsed(0);
    setIsRunning(false);
    setIsPaused(false);
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
    isPaused,
    handleStart,
    handlePause,
    handleReset,
    formatTime,
    calculateMoney,
  };
}

export default useStationed;
