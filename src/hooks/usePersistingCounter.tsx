import React, { useState } from 'react';
import { getPersistedCounter } from '../store/counterStore';

export const usePersistingCounter = (limit = 0) => {
  const [state, setState] = useState(true); //Boolean State
  const count = getPersistedCounter();
  React.useEffect(() => {
    if (limit > 0) {
      count >= limit ? setState(false) : setState(true);
    }
  }, [count]);
  return { state, count };
};
