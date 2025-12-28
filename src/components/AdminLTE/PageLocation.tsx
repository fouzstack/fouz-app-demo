import { useLocation } from 'react-router-dom';
import { routes } from '../../pages';

export function PageLocation() {
  const location = useLocation();
  const currentRoute = routes.find((route) => route.path === location.pathname);
  return (
    <h1 className='text-xs text-indigo-100 tracking-widest'>
      {currentRoute?.name || 'Página Desconocida'}
    </h1>
  );
}
