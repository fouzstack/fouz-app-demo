import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogIcon from '../icons/BlogIcon';
import ShareIcon from '../icons/ShareIcon';
import UserEditIcon from '../icons/UserEditIcon';
import { formatDateAndTime } from '../../models/utils';

interface Option {
  option: number;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

const InventoryOptionsDropdown = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const options: Option[] = [
    {
      option: 1,
      label: 'Exportar o Importar Inventario',
      icon: <ShareIcon size={20} />,
      action: () => navigate('/exportar/importar/inventario'),
    },
    {
      option: 2,
      label: 'Crear Nuevo Inventario',
      icon: <UserEditIcon size={20} color='#00897b' />,
      action: () => navigate('/crear/inventario'),
    },
    {
      option: 3,
      label: 'Análisis del Inventario',
      icon: <BlogIcon size={20} color='#0f78ef' />,
      action: () => navigate('/informacion/general'),
    },
  ];
  const formatted = formatDateAndTime();

  return (
    <div className='relative  min-w-[320px] z-10'>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className='flex items-center justify-between w-full px-2 py-1 bg-white rounded-lg shadow hover:shadow-md text-gray-900 text-base font-semibold focus:outline-none transition'
      >
        <span>{`${formatted.date}, ${formatted.time}`}</span>
        <svg
          className={`ml-2 h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          <path
            d='M19 9l-7 7-7-7'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      <div
        className={`absolute min-w-[300px] !z-10 left-0 w-full mt-2 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/10 transition-all duration-300 origin-top ${
          open
            ? 'scale-y-100 opacity-100'
            : 'scale-y-95 opacity-0 pointer-events-none'
        }`}
        style={{ transitionProperty: 'transform, opacity' }}
      >
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => {
              opt.action();
              setOpen(false); // cerrar dropdown tras acción (opcional)
            }}
            className='flex  z-10 items-center w-full px-5 py-4 text-md text-left text-gray-600 hover:bg-gray-50 transition relative overflow-hidden focus:bg-gray-100'
            onMouseDown={(e) => {
              // Ripple effect básico
              const ripple = document.createElement('span');
              ripple.className =
                'absolute bg-gray-300 rounded-full opacity-20 pointer-events-none';
              ripple.style.left = `${e.nativeEvent.offsetX}px`;
              ripple.style.top = `${e.nativeEvent.offsetY}px`;
              ripple.style.width = ripple.style.height = '120px';
              ripple.style.transform = 'translate(-50%,-50%) scale(0)';
              ripple.style.transition = 'transform .5s, opacity .5s';
              e.currentTarget.appendChild(ripple);
              setTimeout(
                () =>
                  (ripple.style.transform = 'translate(-50%,-50%) scale(1)'),
                0,
              );
              setTimeout(() => (ripple.style.opacity = '0'), 400);
              setTimeout(() => ripple.remove(), 600);
            }}
          >
            {opt.icon}
            <span className='ml-4 text-gray-900'>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InventoryOptionsDropdown;
