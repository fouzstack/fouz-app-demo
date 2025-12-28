import { useState, useEffect, useRef } from 'react';

export const useCounterLogic = () => {
  const [count, setCount] = useState(0);
  const [incrementIndex, setIncrementIndex] = useState(0);
  const intervalRef = useRef(null);

  const increments = [50, 100, 200, 300, 400, 500, 600, 800, 900, 1000];

  const startChanging = (isIncreasing: boolean, level = 1) => {
    if (!intervalRef.current) {
      // @ts-expect-error
      intervalRef.current = setInterval(() => {
        setCount((prevCount) => {
          if (isIncreasing) {
            return prevCount + level;
          } else {
            return Math.max(prevCount - 1, 0);
          }
        });
      }, 100);
    }
  };

  const stepChange = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setCount((prevCount) => Math.min(prevCount + 1, 100));
    } else if (direction === 'down') {
      setCount((prevCount) => Math.max(prevCount - 1, 0));
    }
  };

  const stopChanging = () => {
    // @ts-expect-error
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    return () => stopChanging();
  }, []);

  const reset = () => {
    if (incrementIndex < increments.length) {
      setCount(() => increments[incrementIndex]);
      setIncrementIndex((prevIndex) => prevIndex + 1);
    } else {
      setCount(0); // Reiniciar el conteo después de 1000
      setIncrementIndex(0); // Reiniciamos el índice de incremento
    }
  };

  return { stepChange, startChanging, stopChanging, count, reset };
};
