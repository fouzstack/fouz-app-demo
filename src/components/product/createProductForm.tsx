import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useGenericMutation } from './useCreateProductMutation';
import toast from 'react-hot-toast';
import { productdb } from '../../models/product.database';
import {
  CreateProductFormData,
  CreateProductSchema,
} from '../../schemas/product.schema';
import { mapFormDataToProduct } from './product-mapper';

const CreateProductForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      cost: 0,
      price: 0,
      unit: '',
    },
  });

  const navigate = useNavigate();
  const { mutation } = useGenericMutation(productdb.add, ['product-list']);

  const watchedCost = watch('cost');
  const watchedPrice = watch('price');

  const calculateMargin = () => {
    if (!watchedCost || !watchedPrice || watchedCost === 0) return 0;
    return ((watchedPrice - watchedCost) / watchedCost) * 100;
  };

  const margin = calculateMargin();
  const marginColor =
    margin >= 30
      ? 'text-[#10B981]'
      : margin >= 15
        ? 'text-[#F59E0B]'
        : 'text-[#EF4444]';

  const onSubmit = async (data: CreateProductFormData) => {
    try {
      const productData = mapFormDataToProduct(data);
      await mutation.mutateAsync(productData);
      toast.success('✅ Producto creado exitosamente');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`❌ Error al crear el producto: ${errorMessage}`);
    }
  };

  React.useEffect(() => {
    if (mutation.isError) {
      const errorMessage =
        mutation.error instanceof Error
          ? mutation.error.message
          : 'Error desconocido';
      toast.error(`❌ Error: ${errorMessage}`);
    }
  }, [mutation.isError, mutation.error]);

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-300 px-4 py-8'>
      <div className='w-full mx-auto max-w-md  rounded-2xl border border-[#334155] p-8 shadow-2xl shadow-[#0F172A]/50 backdrop-blur-sm'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold '>Crear Producto</h2>
          <p className='text-[#94A3B8] text-xs mt-2'>
            Complete los detalles del producto
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 '>
          {/* Nombre del Producto */}
          <div className='group'>
            <Input
              color='primary'
              type='text'
              label='Nombre del Producto'
              variant='underlined'
              {...register('name')}
              classNames={{
                base: 'group',
                label:
                  'text-sm font-medium !text-gray-200 group-focus-within:text-[#60A5FA] transition-colors',
                input: [
                  '!text-gray-200 text-base',
                  'placeholder:text-[#64748B]',
                  'caret-[#60A5FA]',
                  'bg-transparent',
                ],
              }}
            />
            {errors.name && (
              <p className='text-[#EF4444] mt-2 text-sm flex items-center gap-1'>
                <span>⚠</span> {errors.name.message}
              </p>
            )}
          </div>

          {/* Unidad de Medida */}
          <div className='group'>
            <Input
              color='primary'
              type='text'
              label='Unidad de Medida'
              variant='underlined'
              {...register('unit')}
              classNames={{
                base: 'group',
                label:
                  'text-sm font-medium !text-gray-200 group-focus-within:text-[#60A5FA] transition-colors',
                input: [
                  '!text-gray-200 text-base',
                  'placeholder:text-[#64748B]',
                  'caret-[#60A5FA]',
                  'bg-transparent',
                ],
              }}
            />
            {errors.unit && (
              <p className='text-[#EF4444] mt-2 text-sm flex items-center gap-1'>
                <span>⚠</span> {errors.unit.message}
              </p>
            )}
          </div>

          {/* Precio de Costo */}
          <div className='group'>
            <Input
              color='primary'
              type='number'
              label='Precio de Costo'
              variant='underlined'
              {...register('cost', { valueAsNumber: true })}
              classNames={{
                base: 'group',
                label:
                  'text-sm font-medium !text-gray-200 group-focus-within:text-[#60A5FA] transition-colors',
                input: [
                  '!text-gray-200 text-base',
                  'placeholder:text-[#64748B]',
                  'caret-[#60A5FA]',
                  'bg-transparent',
                ],
              }}
              //placeholder='0.00'
            />
            {errors.cost && (
              <p className='text-[#EF4444] mt-2 text-sm flex items-center gap-1'>
                <span>⚠</span> {`${errors.cost.message}`}
              </p>
            )}
          </div>

          {/* Precio de Venta */}
          <div className='group'>
            <Input
              color='primary'
              type='number'
              label='Precio de Venta'
              variant='underlined'
              {...register('price', { valueAsNumber: true })}
              classNames={{
                base: 'group',
                label:
                  'text-sm font-medium !text-gray-200 group-focus-within:text-[#60A5FA] transition-colors',
                input: [
                  '!text-gray-200 text-base',
                  'placeholder:text-[#64748B]',
                  'caret-[#60A5FA]',
                  'bg-transparent',
                ],
              }}
              //placeholder='0.00'
            />
            {errors.price && (
              <p className='text-[#EF4444] mt-2 text-sm flex items-center gap-1'>
                <span>⚠</span> {String(errors.price.message)}
              </p>
            )}
          </div>

          {/* Información de Margen */}
          {watchedCost > 0 && watchedPrice > 0 && (
            <div className='bg-[#1E293B] border border-[#334155] rounded-lg p-4 space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-[#94A3B8]'>Margen de ganancia:</span>
                <span className={`font-medium ${marginColor}`}>
                  {margin.toFixed(1)}%
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-[#94A3B8]'>Ganancia por unidad:</span>
                <span className='text-gray-200'>
                  ${(watchedPrice - watchedCost).toFixed(2)}
                </span>
              </div>
              {margin < 15 && (
                <div className='text-[#F59E0B] text-sm flex items-center gap-1'>
                  <span>💡</span> Margen bajo recomendado
                </div>
              )}
            </div>
          )}

          <div className='flex flex-col gap-3 mt-6'>
            <Button
              color='primary'
              type='submit'
              isLoading={isSubmitting || mutation.isPending}
              className='w-full font-semibold'
            >
              {isSubmitting || mutation.isPending
                ? 'Creando...'
                : 'Crear Producto'}
            </Button>

            <Button
              className='w-full font-semibold'
              onPress={() => navigate('/')}
              isDisabled={isSubmitting || mutation.isPending}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductForm;
