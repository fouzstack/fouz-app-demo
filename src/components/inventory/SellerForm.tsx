import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

interface SellerFormProps {
  onSubmit: (seller: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const SellerForm: React.FC<SellerFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [seller, setSeller] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seller.trim() && !isSubmitting) {
      onSubmit(seller);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-300 mb-2'>
            Nombre del Vendedor
          </label>
          <Input
            type='text'
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
            placeholder='Ej: Juan Pérez'
            className='w-full bg-gray-800/50 border-gray-700 text-gray-200'
            variant='bordered'
            size='lg'
            isRequired
            isDisabled={isSubmitting}
            startContent={
              <svg
                className='w-5 h-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            }
          />
        </div>

        <div className='bg-blue-500/10 border border-blue-500/20 rounded-lg p-3'>
          <div className='flex items-start gap-2'>
            <svg
              className='w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <p className='text-xs text-blue-300'>
              Este nombre se incluirá en el archivo JSON exportado y será
              visible en el servidor.
            </p>
          </div>
        </div>
      </div>

      <div className='flex gap-3'>
        <Button
          type='button'
          onPress={onCancel}
          className='flex-1 h-12 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors duration-300 rounded-xl font-medium border border-gray-700/50'
          variant='flat'
          isDisabled={isSubmitting}
        >
          Cancelar
        </Button>

        <Button
          type='submit'
          className='flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50'
          isDisabled={!seller.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <div className='flex items-center justify-center gap-2'>
              <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
              <span>Procesando...</span>
            </div>
          ) : (
            'Continuar Exportación'
          )}
        </Button>
      </div>
    </form>
  );
};

export default SellerForm;
