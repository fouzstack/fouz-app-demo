import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { useNavigate } from 'react-router-dom';
import { useDeleteMutation } from '../../hooks/useDeleteMutation';
import inventory from '../../models/inventorydb';

import {
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useProductStore } from '../../store/store';
import toast from 'react-hot-toast';

const ConfirmDeleteButton: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const product = useProductStore((state) => state.product);

  const { mutation: deleteMutation } = useDeleteMutation(
    product?.id || undefined,
    inventory.deleteProduct,
  );

  const handleDelete = async () => {
    if (!product?.id) return;

    try {
      await deleteMutation.mutateAsync();
      navigate('/finales');
    } catch (error) {
      //console.error("Error al eliminar el producto:", error);
      toast.error('Operación Fallida!');
    } finally {
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    if (!product) {
      console.warn('No hay producto seleccionado para eliminar');
      return;
    }
    setShowModal(true);
  };

  // Si no hay producto, no renderizar el botón
  if (!product) {
    return null;
  }

  return (
    <>
      <Button
        color='danger'
        onClick={handleOpenModal}
        disabled={deleteMutation.isPending || !product}
        className='flex items-center font-medium tracking-widest w-full'
        aria-label='Eliminar producto'
      >
        Eliminar
        <TrashIcon className='ml-2 w-4 h-4' />
      </Button>

      {showModal && (
        <div
          className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 backdrop-blur-sm'
          role='dialog'
          aria-labelledby='delete-modal-title'
          aria-modal='true'
        >
          <div className='bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl w-96 max-w-full mx-4'>
            {/* Header del modal */}
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center'>
                <div className='bg-red-500/10 p-2 rounded-lg mr-3'>
                  <ExclamationTriangleIcon className='w-6 h-6 text-red-500' />
                </div>
                <h3
                  id='delete-modal-title'
                  className='text-lg font-semibold text-white'
                >
                  Confirmar Eliminación
                </h3>
              </div>
              <Button
                onClick={handleCancel}
                className='text-gray-400 hover:text-white transition-colors duration-200'
                aria-label='Cerrar modal'
              >
                <XMarkIcon className='w-5 h-5' />
              </Button>
            </div>

            {/* Contenido del mensaje */}
            <div className='mb-6'>
              <p className='text-gray-300 mb-3'>
                ¿Estás seguro de que deseas eliminar el producto?
              </p>
              <div className='bg-gray-800 rounded-lg p-4 border border-gray-700 mb-3'>
                <p className='text-white font-medium'>{product.name}</p>
              </div>
              <div className='flex items-center gap-2 text-sm text-red-400 font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2'>
                <ExclamationTriangleIcon className='w-4 h-4' />
                <span>Esta acción no se puede deshacer</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className='flex justify-end space-x-3'>
              <Button
                onClick={handleCancel}
                disabled={deleteMutation.isPending}
                className='flex items-center text-gray-300 bg-gray-700 font-medium'
              >
                <XMarkIcon className='w-4 h-4 mr-2' />
                Cancelar
              </Button>
              <Button
                color='danger'
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className='flex items-center px-4 py-2 text-white font-medium'
              >
                {deleteMutation.isPending ? (
                  <>
                    <svg
                      className='animate-spin mr-2 h-4 w-4 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <TrashIcon className='w-4 h-4 mr-2' />
                    Eliminar Definitivamente
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmDeleteButton;
