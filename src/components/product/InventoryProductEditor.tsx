import { useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ConfirmDeleteButton from '../table-updater/ConfirmDeleteButton';
import { useInventoryMutation } from '../table-updater/useInventoryMutation';
import { useUpdateProductForm } from '../table-updater/useUpdateProductForm';

export default function InventoryProductEditor() {
  const navigate = useNavigate();
  const [showToaster, setShowToaster] = useState(false);
  const { errors, register, handleSubmit, product } = useUpdateProductForm();
  const mutation = useInventoryMutation(product.id || 0);

  useEffect(() => {
    if (showToaster) {
      const timer = setTimeout(() => {
        setShowToaster(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToaster]);

  const onSubmit = async (data: any) => {
    try {
      await mutation.mutateAsync({
        ...data,
      });
      setShowToaster(true);
      navigate('/finales');
    } catch (error) {
      console.error('Error en actualización:', error);
    }
  };

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center py-8 bg-[#0d0f12]'>
      {showToaster && <Toaster />}

      {/* Header con título */}
      <div className='w-full max-w-2xl mb-8 text-center'>
        <h2 className='text-2xl font-bold text-gray-100 mb-2'>
          Editar Producto
        </h2>
        <p className='text-gray-400 text-sm'>
          Actualiza la información del producto en el inventario
        </p>
      </div>

      {/* Tarjeta de formulario */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-md min-w-[320px] bg-[#111318] border border-gray-800 rounded-xl shadow-2xl shadow-black/30 p-6 animate-fade-in'
      >
        {/* Campo Nombre */}
        <div className='mb-6'>
          <Input
            variant='bordered'
            {...register('name')}
            label='Nombre de Producto'
            defaultValue={product.name}
            classNames={{
              label: '!text-gray-300 !text-sm !font-medium',
              input: '!text-gray-100 !text-base !placeholder-gray-500',
              innerWrapper: '!bg-transparent',
              inputWrapper: `
                !bg-transparent 
                !border !border-gray-700 
                !rounded-lg 
                hover:!border-amber-500/40 
                focus-within:!border-amber-500 
                !transition-all !duration-300
                !shadow-sm !shadow-black/20
              `,
            }}
          />
          {errors.name && (
            <p className='text-red-400 text-sm mt-2 ml-1'>
              {String(errors.name.message)}
            </p>
          )}
        </div>

        {/* Campo Unidad de Medida */}
        <div className='mb-6'>
          <Input
            variant='bordered'
            {...register('unit')}
            label='Unidad de Medida'
            defaultValue={product.unit.toString()}
            classNames={{
              label: '!text-gray-300 !text-sm !font-medium',
              input: '!text-gray-100 !text-base !placeholder-gray-500',
              innerWrapper: '!bg-transparent',
              inputWrapper: `
                !bg-transparent 
                !border !border-gray-700 
                !rounded-lg 
                hover:!border-amber-500/40 
                focus-within:!border-amber-500 
                !transition-all !duration-300
                !shadow-sm !shadow-black/20
              `,
            }}
          />
          {errors.unit && (
            <p className='text-red-400 text-sm mt-2 ml-1'>
              {String(errors.unit.message)}
            </p>
          )}
        </div>

        {/* Campo Costo */}
        <div className='mb-6'>
          <Input
            variant='bordered'
            {...register('cost', { valueAsNumber: true })}
            label='Costo'
            type='number'
            defaultValue={product.cost.toString()}
            placeholder={product?.cost.toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            classNames={{
              label: '!text-gray-300 !text-sm !font-medium',
              input: '!text-gray-100 !text-base !placeholder-gray-500',
              innerWrapper: '!bg-transparent',
              inputWrapper: `
                !bg-transparent 
                !border !border-gray-700 
                !rounded-lg 
                hover:!border-amber-500/40 
                focus-within:!border-amber-500 
                !transition-all !duration-300
                !shadow-sm !shadow-black/20
              `,
            }}
          />
          {errors.cost && (
            <p className='text-red-400 text-sm mt-2 ml-1'>
              {String(errors.cost.message)}
            </p>
          )}
        </div>

        {/* Campo Precio Unitario */}
        <div className='mb-8'>
          <Input
            variant='bordered'
            {...register('price', { valueAsNumber: true })}
            label='Precio Unitario'
            type='number'
            defaultValue={product.price.toString()}
            placeholder={product?.price.toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            classNames={{
              label: '!text-gray-300 !text-sm !font-medium',
              input: '!text-gray-100 !text-base !placeholder-gray-500',
              innerWrapper: '!bg-transparent',
              inputWrapper: `
                !bg-transparent 
                !border !border-gray-700 
                !rounded-lg 
                hover:!border-amber-500/40 
                focus-within:!border-amber-500 
                !transition-all !duration-300
                !shadow-sm !shadow-black/20
              `,
            }}
          />
          {errors.price && (
            <p className='text-red-400 text-sm mt-2 ml-1'>
              {String(errors.price.message)}
            </p>
          )}
        </div>

        {/* Botones de acción */}
        <div className='space-y-4'>
          {/* Botón Actualizar */}
          <Button
            type='submit'
            className={`
              w-full 
              bg-amber-600 hover:bg-amber-700 
              text-gray-900 font-semibold
              rounded-xl 
              shadow-lg hover:shadow-amber-500/40 
              transform hover:scale-[1.02]
              transition-all duration-300
              h-12
            `}
            isLoading={mutation.isPending}
            spinner={
              <div className='h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin' />
            }
          >
            {mutation.isPending ? 'Actualizando...' : 'Actualizar Producto'}
          </Button>

          {/* Botón Cancelar */}
          <Button
            onPress={() => navigate('/finales')}
            className={`
              w-full 
              bg-gray-800 hover:bg-gray-700 
              text-gray-300 font-medium
              border border-gray-700
              rounded-xl 
              shadow-sm hover:shadow-gray-500/20
              transform hover:scale-[1.02]
              transition-all duration-300
              h-12
            `}
          >
            Cancelar
          </Button>

          {/* Botón Eliminar */}
          <div className='pt-2'>
            <ConfirmDeleteButton />
          </div>
        </div>
      </form>

      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        
        /* Estilos para el Toaster */
        .toast {
          background-color: #111318 !important;
          border: 1px solid rgba(251, 191, 36, 0.3) !important;
          color: #f3f4f6 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
        }
        
        .toast-success {
          border-left: 4px solid #10b981 !important;
        }
        
        .toast-error {
          border-left: 4px solid #ef4444 !important;
        }
      `}</style>
    </div>
  );
}
