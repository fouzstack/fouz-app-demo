// components/layout/Footer.tsx
import { NavLink, useLocation } from 'react-router-dom';
//import { useCounterStore } from '../../store/counterStore';

export const Footer = () => {
  //const increase = useCounterStore((state) => state.increase);
  const location = useLocation();

  const links = [
    { path: '/', label: 'Inicio' },
    { path: '/entradas', label: 'Entradas' },
    { path: '/ajustes', label: 'Ajustes' },
    { path: '/finales', label: 'Finales' },
    { path: '/ventas', label: 'Vendido' },
    { path: '/tabla/integral', label: 'Tabla' },
  ];

  return (
    <footer className='bg-gray-900/95 backdrop-blur-lg border-t border-gray-700  text-white w-full'>
      <nav className='flex overflow-x-auto  no-scrollbar p-4 px-6 gap-6 text-xs [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scrollbar-hide'>
        {links.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            //onClick={increase}
            className={`text-sm transition-colors duration-150 ${
              location.pathname === path
                ? 'text-yellow-500 font-extrabold tracking-widest'
                : 'text-gray-400 hover:text-white '
            }`}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </footer>
  );
};
