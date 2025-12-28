import React, { useState } from 'react';
import { getPersistedCounter } from '../../store/counterStore';

export const useTrialAppExpiration = (limit = 0) => {
  const [show, setShow] = useState(true);
  const count = getPersistedCounter();
  React.useEffect(() => {
    if (limit > 0) {
      count >= limit ? setShow(false) : setShow(true);
    }
  }, [count]);
  return { show, count };
};
