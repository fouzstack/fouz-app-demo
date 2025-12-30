import { useState } from 'react';

export const useQuantityCounter = () => {
  const [quantity, setQuantity] = useState(0);
  const increase = () => setQuantity((prev) => prev + 5);
  const decrease = () => setQuantity((prev) => prev - 1);
  const reset = () => setQuantity(0);
  return { increase, decrease, reset, quantity };
};
