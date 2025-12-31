import { NavLink, useLocation } from 'react-router-dom';
import React from 'react';

export const Footer: React.FC = () => {
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
    <footer
      className='
        w-full bg-[#0f1115]/95 backdrop-blur-xl 
        border-t border-gray-800 
        text-gray-300 
        shadow-[0_-4px_12px_rgba(0,0,0,0.35)]
      '
    >
      <nav
        className='
          flex items-center justify-start 
          overflow-x-auto no-scrollbar scrollbar-hide
          gap-4 px-6 py-3 
          text-sm font-medium
          select-none
        '
      >
        {links.map(({ path, label }) => {
          const isActive = location.pathname === path;

          return (
            <NavLink
              key={path}
              to={path}
              className={`
                relative px-3 py-1.5 rounded-full whitespace-nowrap
                transition-all duration-200
                ${
                  isActive
                    ? 'text-amber-400 font-semibold bg-gray-800/60 shadow-inner shadow-black/40'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                }
              `}
            >
              {/* Indicador activo */}
              {isActive && (
                <span
                  className='
                    absolute -top-1 left-1/2 -translate-x-1/2 
                    w-2 h-2 rounded-full bg-amber-400 
                    animate-pulse
                  '
                />
              )}

              {label}
            </NavLink>
          );
        })}
      </nav>
    </footer>
  );
};
