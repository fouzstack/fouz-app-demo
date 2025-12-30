// components/UserMenu.tsx
import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@heroui/button';
import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useCounterStore } from '../../store/counterStore';

export const UserMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const count = useCounterStore((state) => state.count);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='flex items-center space-x-4' ref={dropdownRef}>
      {/* Botón de notificaciones */}
      <button className='relative p-2 text-gray-300 hover:bg-gray-800 rounded-xl transition-all duration-100 group'>
        <BellIcon className='w-4 h-4' />
        <span className='absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse'></span>
        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform'>
          {count}
        </span>
      </button>

      {/* Menú de usuario con dropdown */}
      <div className='relative'>
        <div
          className='flex items-center space-x-3 bg-gray-800 rounded-2xl p-2 pr-4 cursor-pointer hover:bg-gray-700 transition duration-150'
          onClick={toggleDropdown}
        >
          <div className='relative'>
            <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center'>
              <span className='text-xs font-bold text-white'>{count}</span>
            </div>
            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900'></div>
          </div>
          <div className='hidden md:block text-white'>
            <p className='text-sm font-medium'>Asistencia</p>
            <p className='text-xs text-gray-400'>
              &copy; {new Date().getFullYear()}
            </p>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className='absolute right-0 top-full mt-2 w-64 bg-gray-800 rounded-xl shadow-lg py-2 z-50 border border-gray-700 backdrop-blur-lg'>
            <div className='px-4 py-3 border-b border-gray-700'>
              <p className='text-sm font-medium text-white'>
                Asistencia al usuario
              </p>
              <p className='text-xs text-gray-400 mt-1'>Giovani Fouz</p>
            </div>

            <div className='px-4 py-3'>
              <div className='flex items-center space-x-3 mb-3'>
                <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                  <span className='text-xs text-white'>📞</span>
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Teléfono</p>
                  <p className='text-sm text-white'>+53 54 27 88 15</p>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center'>
                  <span className='text-xs text-white'>👤</span>
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Email</p>
                  <p className='text-xs text-white'>gfouz1975@gmail.com</p>
                </div>
              </div>
            </div>

            <div className='px-4 py-2 border-t border-gray-700'>
              <div className='py-1'></div>
              <NavLink
                to='/editar/producto'
                className='p-2 text-white bg-blue-950 text-center w-full flex justify-center rounded-xl'
              >
                Editar Productos
              </NavLink>
              <div className='py-2'></div>
              <Button
                color='danger'
                variant='flat'
                onClick={() => setIsDropdownOpen(false)}
                className='w-full text-white'
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
