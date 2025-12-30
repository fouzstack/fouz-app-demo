import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

import RedTrashIcon from '../icons/RedTrashIcon';
import EditIcon from '../icons/EditIcon';

export default function SphericalDropdown({
  deleteHandleClick,
}: {
  deleteHandleClick: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className='relative flex flex-col items-center'>
      {/* Botón circular principal */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className='w-10 h-10 bg-gray-700 rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-110'
        aria-label='Abrir menú'
      >
        <svg
          className='w-8 h-8 text-white'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <circle
            cx='12'
            cy='12'
            r='10'
            stroke='white'
            strokeWidth='2'
            fill='none'
          />
        </svg>
      </button>

      {/* Opciones: esferas flotantes con texto y tooltip */}
      <div
        className={`flex flex-col gap-4 mt-2 transition-all duration-500 ${
          open
            ? 'opacity-100 translate-y-4 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div
          onClick={() => {
            navigate('/actualizar/producto');
          }}
          className='z-10 flex items-center space-x-3 group relative'
        >
          <button className='w-10 h-10  bg-[#328bf1] rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300'>
            <EditIcon size={20} color='#ffffff' />
          </button>
          <span className='cursor-pointer text-gray-700 font-black'>
            Editar este producto
          </span>
        </div>

        <div
          onClick={deleteHandleClick}
          className='flex items-center space-x-3 group'
        >
          <button className='w-10 h-10 bg-danger rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300'>
            <div className='cursor-pointer'>
              <RedTrashIcon size={20} color='#ffffff' />
            </div>
          </button>
          <span className='cursor-pointer text-gray-700 font-black'>
            Eliminar este producto!
          </span>
        </div>
      </div>
    </div>
  );
}
