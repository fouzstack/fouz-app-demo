import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { useTableModalMutation } from '../../hooks/useTableModalMutation';
import { updateInventoryTable } from '../../models/inventorydb';
import NumericKeyboard from '../numericKeyboard/NumericKeyboard';
//import { useCounterStore } from '../../store/counterStore';
//import FloatingActionButton from './FinalProductFAB'; // Make sure this path is correct
import { useDelayedNavigation } from './useDelayedNavigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useProductStore } from '../../store/store';
//import ConfirmDeleteButton from './ConfirmDeleteButton';

const FinalProductsInput = () => {
  //const count = useCounterStore((state) => state.count);
  const product = useProductStore((state) => state.product);

  const navigate = useNavigate();

  const available =
    product?.initial_products + product?.incoming_products - product?.losses;

  const FinalProductsSchema = z.object({
    final_products: z
      .string()
      .nonempty('El campo no puede estar vacío')
      .refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num >= 0;
        },
        {
          message: 'La cantidad debe ser un número positivo!',
        },
      )
      .refine(
        (val) => {
          const num = parseFloat(val);
          return num <= available;
        },
        {
          message: `Los finales deben ser menor o igual a ${available}!`,
        },
      ),
  });

  type FinalProductsFormData = z.infer<typeof FinalProductsSchema>;

  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FinalProductsFormData>({
    resolver: zodResolver(FinalProductsSchema),
    defaultValues: {
      final_products: (product.final_products ?? 0).toString(),
    },
  });

  const [overflow, setOverflow] = useState(false);
  const [activeInput, setActiveInput] = useState<'sold' | 'final'>('final');
  const [soldProducts, setSoldProducts] = useState(
    (available - (product.final_products ?? available)).toFixed(2),
  );
  const [finalProductsInput, setFinalProductsInput] = useState(
    (product.final_products ?? 0).toString(),
  );
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const { mutation: updateMutation } = useTableModalMutation(
    product.id || 0,
    updateInventoryTable,
  );

  // Mostrar notificaciones en caso de mutaciones
  useEffect(() => {
    if (updateMutation.isSuccess) {
      toast.success(updateMutation.data || 'El producto se ha actualizado.');
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 2000);
    } else if (updateMutation.isError) {
      toast.error(`Error al actualizar: ${updateMutation.error}`);
    }
  }, [
    updateMutation.isSuccess,
    updateMutation.isError,
    updateMutation.data,
    updateMutation.error,
  ]);

  // Sincronizar valores del input
  useEffect(() => {
    const finalNum = parseFloat(finalProductsInput);
    const soldNum = parseFloat(soldProducts);

    if (activeInput === 'final' && !isNaN(finalNum)) {
      const soldCalc = available - finalNum;
      setSoldProducts(soldCalc >= 0 ? soldCalc.toFixed(2) : '0');
    } else if (activeInput === 'sold' && !isNaN(soldNum)) {
      const finalCalc = available - soldNum;
      const finalStr = finalCalc >= 0 ? finalCalc.toFixed(2) : '0';
      setFinalProductsInput(finalStr);
      setValue('final_products', finalStr, { shouldValidate: true });
    }
  }, [activeInput, finalProductsInput, soldProducts]);

  const onSubmit = async (data: FinalProductsFormData) => {
    const finalNum = parseFloat(data.final_products);
    if (isNaN(finalNum)) return;
    // This will not be triggered by FAB actions
    await updateMutation.mutateAsync({
      final_products: finalNum,
      incoming_products: product.incoming_products,
      initial_products: product.initial_products,
      losses: product.losses,
    });
  };

  const handleKeyPress = (
    key: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault(); // Prevent form submission if FAB action clicks this
    const currentVal =
      activeInput === 'final' ? finalProductsInput : soldProducts;

    if (key === 'del') {
      const newValue = currentVal.slice(0, -1);
      if (activeInput === 'final') {
        setFinalProductsInput(newValue);
        setValue('final_products', newValue, { shouldValidate: true });
      } else {
        setSoldProducts(newValue);
      }
    } else if (!(key === '.' && currentVal.includes('.'))) {
      const newValue = currentVal === '0' ? key : currentVal + key;
      if (activeInput === 'final') {
        setFinalProductsInput(newValue);
        setValue('final_products', newValue, { shouldValidate: true });
      } else {
        setSoldProducts(newValue);
      }
    }
  };

  useEffect(() => {
    const num = Number(finalProductsInput);
    if (!isNaN(num) && num > available) {
      setError('final_products', {
        type: 'manual',
        message: `Debe ser ≤ ${available}`,
      });
      setOverflow(true);
    } else {
      clearErrors('final_products');
      setOverflow(false);
    }
  }, [finalProductsInput, available, setError, clearErrors]);

  useDelayedNavigation(updateMutation.isSuccess, 2000, '/finales');

  return (
    <>
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className='bg-gray-900 relative'>
        {' '}
        {/* Added relative for FAB positioning */}
        <div className='max-w-xl mx-auto'>
          {/* Blurred card container (FAB moved outside to avoid blur) */}
          <div className=''>
            {showSuccessAnimation && (
              <div className='absolute inset-0 flex items-center justify-center z-10 bg-gray-900 bg-opacity-90 rounded-xl'>
                <div className='animate-bounce flex flex-col items-center'>
                  <CheckCircleIcon className='h-16 w-16 text-green-400 mb-2' />
                  <span className='text-white font-semibold'>
                    ¡Actualizado!
                  </span>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className='rounded-xl p-6 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 shadow-2xl text-gray-100'
            >
              {/* Input productos vendidos */}
              <div className='mb-6 flex'>
                <Input
                  type='text'
                  inputMode='none'
                  label={
                    <span
                      className={`flex text-xl items-center gap-2 ${activeInput !== 'final' ? 'text-yellow-300' : 'text-gray-400'}`}
                    >
                      Productos Vendidos
                    </span>
                  }
                  variant='underlined'
                  value={soldProducts}
                  onChange={(e) => {
                    setSoldProducts(e.target.value);
                    setActiveInput('sold');
                  }}
                  onFocus={() => setActiveInput('sold')}
                  color={
                    Number(soldProducts) > available ? 'danger' : 'primary'
                  }
                  aria-label='Productos vendidos'
                  classNames={{
                    base: 'mb-2',
                    label: '!text-gray-100 !text-xl',
                    input: `!bg-transparent !text-gray-100 !font-bold tracking-widest text-lg ml-2 ${
                      Number(soldProducts) > available
                        ? '!text-danger animate-pulse'
                        : '!text-green-400'
                    }`,
                  }}
                />
                <span className='text-xl text-gray-400 block'>
                  A la Venta:{' '}
                  <span className='font-bold text-blue-400'>
                    {available.toFixed(2)}
                  </span>
                </span>
                {Number(soldProducts) > available && (
                  <p className='py-1 text-danger text-xl font-semibold flex items-center gap-2'>
                    Debe ser menor o igual a {available}
                  </p>
                )}
              </div>

              {/* Input productos finales */}
              <div className='mb-2 relative'>
                <Input
                  type='text'
                  inputMode='none'
                  label={
                    <span
                      className={`flex !text-xl items-center gap-2 ${activeInput === 'final' ? 'text-yellow-300' : 'text-gray-500'}`}
                    >
                      Productos Finales
                    </span>
                  }
                  variant='underlined'
                  value={finalProductsInput}
                  onChange={(e) => {
                    setFinalProductsInput(e.target.value);
                    setValue('final_products', e.target.value, {
                      shouldValidate: true,
                    });
                    setActiveInput('final');
                  }}
                  onFocus={() => setActiveInput('final')}
                  color={finalProductsInput === '0' ? 'danger' : 'primary'}
                  classNames={{
                    base: 'mb-2',
                    label: `!font-bold text-base ${finalProductsInput === '0' ? '!text-danger' : '!text-gray-100'}`,
                    input: `!bg-transparent !font-bold tracking-widest text-lg ml-2 ${finalProductsInput === '0' ? '!text-danger animate-pulse' : '!text-purple-400'}`,
                  }}
                />
                {errors.final_products && (
                  <p className='py-1 text-danger text-xs font-semibold flex items-center gap-2'>
                    {String(errors.final_products.message)}
                  </p>
                )}
              </div>

              <NumericKeyboard onKeyPress={handleKeyPress} />
              <p className='text-xs pt-2 tracking-widest'>
                Producto: {product?.name}
              </p>
              <div className='mt-2 gap-4 space-y-2 flex'>
                <Button
                  onPress={() => {
                    navigate('/finales');
                  }}
                  className='w-full '
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  className='w-full '
                  isDisabled={overflow}
                  color={finalProductsInput === '0' ? 'danger' : 'primary'}
                  isLoading={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <span className='flex items-center gap-2'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                      Actualizando...
                    </span>
                  ) : (
                    'Actualizar'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinalProductsInput;
