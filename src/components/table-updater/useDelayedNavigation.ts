// hooks/useDelayedNavigation.ts
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useDelayedNavigation = (
  condition: boolean,
  delay: number = 3000,
  route: string = '/inventario',
) => {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (condition) {
      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Configurar nuevo timeout
      timeoutRef.current = setTimeout(() => {
        navigate(route);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [condition, delay, navigate, route]);
};
