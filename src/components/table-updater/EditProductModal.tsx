import { useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useUpdateProductForm } from './useUpdateProductForm';
import { useInventoryMutation } from './useInventoryMutation';
import ConfirmDeleteButton from './ConfirmDeleteButton';

export default function EditProductModal() {
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
      navigate(`/finales`);
    } catch (error) {
      console.error('Error en actualización:', error);
    }
  };

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-gray-300 px-4 py-8'>
      {showToaster && <Toaster />}
      <h2 className='mb-6 font-semibold text-xl text-center text-gray-200'>
        Editar Producto
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='max-w-[400px] min-w-[320px]  bg-gray-800 rounded-xl p-8 shadow-lg'
      >
        <Input
          color='success'
          variant='underlined'
          {...register('name')}
          label='Nombre de Producto'
          defaultValue={product.name}
          classNames={{
            label: '!text-gray-300',
            input:
              '!bg-gray-700 !text-gray-100 placeholder:!text-gray-400 focus:!border-blue-500',
            //underlinedWrapper: '!border-gray-600',
          }}
        />
        {errors.name && (
          <p className='text-red-500 mt-1'>{String(errors.name.message)}</p>
        )}

        <Input
          color='success'
          variant='underlined'
          {...register('unit')}
          label='Unidad de Medida'
          defaultValue={product.unit.toString()}
          classNames={{
            label: '!text-gray-300',
            input:
              '!bg-gray-700 !text-gray-100 placeholder:!text-gray-400 focus:!border-blue-500',
            //underlinedWrapper: '!border-gray-600',
          }}
        />
        {errors.unit && (
          <p className='text-red-500 mt-1'>{String(errors.unit.message)}</p>
        )}

        <Input
          color='success'
          variant='underlined'
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
            label: '!text-gray-300',
            input:
              '!bg-gray-700 !text-gray-100 placeholder:!text-gray-400 focus:!border-blue-500',
            //underlinedWrapper: '!border-gray-600',
          }}
        />
        {errors.cost && (
          <p className='text-red-500 mt-1'>{String(errors.cost.message)}</p>
        )}

        <Input
          color='success'
          variant='underlined'
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
            label: '!text-gray-300',
            input:
              '!bg-gray-700 !text-gray-100 placeholder:!text-gray-400 focus:!border-blue-500',
            //underlinedWrapper: '!border-gray-600',
          }}
        />
        {errors.price && (
          <p className='text-red-500 mt-1'>{String(errors.price.message)}</p>
        )}

        <Button
          type='submit'
          className='w-full mt-6'
          color='primary'
          //ripple={false}
          //auto
        >
          <span className='text-gray-100'>
            {mutation.isPending ? 'Actualizando...' : 'Actualizar'}
          </span>
        </Button>

        <Button onPress={() => navigate(`/finales`)} className='w-full mt-4'>
          <span className='text-gray-900 hover:text-gray-200 transition-colors duration-200'>
            Cancelar
          </span>
        </Button>
      </form>
      <div className='py-4 mt-3 max-w-[400px] min-w-[320px] px-8 bg-gray-800 rounded-xl'>
        <ConfirmDeleteButton />
      </div>
    </div>
  );
}
