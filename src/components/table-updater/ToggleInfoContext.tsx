import React from 'react';

// Definimos el tipo de la función toggleInfo
export type ToggleInfoContextType = () => void;

// Creamos el contexto con un valor por defecto (función vacía)
export const ToggleInfoContext = React.createContext<ToggleInfoContextType>(
  () => {},
);
