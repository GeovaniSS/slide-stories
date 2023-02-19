import { useRef, useState } from 'react';

export const useTimeout = () => {
  const timeoutRef = useRef<number | null>(null);
  const handlerRef = useRef<TimerHandler>(null!);
  const [startTime, setStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  function start(handler: TimerHandler, time: number) {
    timeoutRef.current = setTimeout(handler, time);
    handlerRef.current = handler;
    setStartTime(Date.now());
    setTimeLeft(time);
    return timeoutRef.current;
  }

  function clear() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  function pause() {
    const passedTime = Date.now() - startTime;
    setTimeLeft((prevTimeLeft) => prevTimeLeft - passedTime);
    clear();
  }

  function resume() {
    clear();
    timeoutRef.current = setTimeout(handlerRef.current, timeLeft);
    setStartTime(Date.now());
  }

  return {
    start,
    clear,
    pause,
    resume,
  };
};
