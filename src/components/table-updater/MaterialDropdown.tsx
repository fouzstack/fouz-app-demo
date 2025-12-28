import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToggleInfoContext } from './ToggleInfoContext';
import { useDeleteMutation } from '../../hooks/useDeleteMutation';
import { GlobalProduct } from '../../store/actions';
import RedTrashIcon from '../icons/RedTrashIcon';
import PlusIcon from '../icons/PlusIcon';
import inventory from '../../models/inventorydb';

interface ProductProps {
  product: GlobalProduct;
}

interface Option {
  option: number;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

const MaterialDropdown = ({ product }: ProductProps) => {
  const toggleInfo = useContext(ToggleInfoContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Mutaciones para borrar producto
  const { mutation: deleteMutation } = useDeleteMutation(
    product.id,
    inventory.deleteProduct,
  );

  const deleteHandleClick = async () => {
    await deleteMutation.mutateAsync();
    navigate('/finales');
  };

  const options: Option[] = [
    {
      option: 1,
      label: 'Editar',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          <path d='M12 20h9' strokeLinecap='round' />
          <path
            d='M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5l-4 1 1-4L16.5 3.5Z'
            strokeLinecap='round'
          />
        </svg>
      ),
      action: () => navigate('/actualizar/producto'),
    },
    {
      option: 2,
      label: 'Información',
      icon: <PlusIcon size={20} color='#00897b' />,
      action: toggleInfo,
    },
    {
      option: 3,
      label: 'Eliminar',
      icon: <RedTrashIcon />,
      action: deleteHandleClick,
    },
  ];

  return (
    <div className='relative w-full '>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className='flex items-center justify-between w-full px-3 py-2 rounded-lg shadow hover:shadow-md text-gray-400 text-base font-semibold focus:outline-none transition'
      >
        {product?.name}
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
        className={`!z-30 absolute py-6  left-0 w-full mt-2 overflow-hidden rounded-xl bg-gray-900 shadow-lg ring-1 ring-black/10 transition-all duration-300 origin-top ${
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
            className='flex z-10 items-center w-full px-5 py-4 text-xs text-left text-gray-400 hover:bg-gray-950 transition relative overflow-hidden focus:bg-gray-100'
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
            <span className='ml-3 text-gray-400 text-xl font-normal'>
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MaterialDropdown;
