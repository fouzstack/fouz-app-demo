// components/IncomingUpdateModal.tsx
import { useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useIncominglMutation } from './useIncominglMutation';
import { updateInventoryTable } from '../../models/inventorydb';
import { useIncomingUpdate } from './useIncomingUpdate';
import NumericKeyboard from '../numericKeyboard/NumericKeyboard';

export default function IncomingProductsModal() {
  const cero = 0;
  const navigate = useNavigate();
  const [showToaster, setShowToaster] = useState(false);

  const { errors, handleSubmit, product, finalProducts, setValue, watch } =
    useIncomingUpdate();

  const { mutation } = useIncominglMutation(
    product.id || 0,
    updateInventoryTable,
  );

  // Sincronizar con el valor del formulario
  const incomingIncrement = watch('incoming_products');
  const [incomingInput, setIncomingInput] = useState(
    incomingIncrement?.toString() || cero.toString(),
  );

  // Sincronizar cuando cambia el valor del formulario
  useEffect(() => {
    setIncomingInput(incomingIncrement?.toString() || cero.toString());
  }, [incomingIncrement]);

  useEffect(() => {
    if (showToaster) {
      const timer = setTimeout(() => {
        setShowToaster(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToaster]);

  // Función para manejar las teclas - actualiza ambos: estado local Y formulario
  const handleKeyPress = (
    key: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    let newValue;

    if (key === 'del') {
      const newInputValue = incomingInput.slice(0, -1);
      newValue = newInputValue === '' ? '0' : newInputValue;
    } else if (!(key === '.' && incomingInput.includes('.'))) {
      newValue = incomingInput === '0' ? key : incomingInput + key;
    } else {
      newValue = incomingInput;
    }

    // Actualizar ambos: estado local Y formulario
    setIncomingInput(newValue);
    setValue('incoming_products', Number(newValue));
  };

  const onSubmit = async (data: any) => {
    // Usar el valor del formulario (que está sincronizado con incomingInput)
    const inputIncomingRaw = data.incoming_products;
    const inputIncoming =
      inputIncomingRaw === undefined ||
      inputIncomingRaw === null ||
      inputIncomingRaw === '' ||
      isNaN(Number(inputIncomingRaw))
        ? null
        : Number(inputIncomingRaw);

    let adjustedIncoming;
    if (inputIncoming === null) {
      adjustedIncoming = product.incoming_products || 0;
    } else {
      adjustedIncoming = (product.incoming_products || 0) + inputIncoming;
    }

    try {
      await mutation.mutateAsync({
        ...data,
        incoming_products: adjustedIncoming,
        final_products: finalProducts,
        initial_products: product.initial_products,
      });
      setShowToaster(true);
      navigate('/entradas');
    } catch (error) {
      console.error('Error en actualización:', error);
    }
  };

  return (
    <div
      style={{ minHeight: '60vh' }}
      className='w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 px-2 py-4'
    >
      {showToaster && (
        <Toaster
          position='top-center'
          toastOptions={{
            duration: 3000,
            style: {
              background: '#10B981',
              color: 'white',
            },
          }}
        />
      )}

      <div className='max-w-xl w-full space-y-4'>
        {/* Form Card */}
        <div className='bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-2'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Current Stock Info */}
            <div className='bg-gray-900/50 rounded-xl p-2 border border-gray-700/30'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div className='text-center'>
                  <p className='text-gray-400'>Actual</p>
                  <p className='text-green-400 font-semibold text-lg'>
                    {(product.incoming_products || 0).toFixed(2)}
                  </p>
                </div>
                <div className='text-center'>
                  <p className='text-gray-400'>Total</p>
                  <p className='text-blue-400 font-semibold text-lg'>
                    {(
                      (product.incoming_products || 0) +
                      Number(incomingInput || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Input Field - Ahora sincronizado */}
            <div className='space-y-2'>
              <Input
                color='success'
                variant='underlined'
                value={incomingInput}
                onChange={(e) => {
                  setIncomingInput(e.target.value);
                  setValue('incoming_products', Number(e.target.value));
                }}
                label='Entrada'
                type='text'
                inputMode='none'
                placeholder={`Actual es: ${(product.incoming_products || 0).toFixed(2)}`}
                classNames={{
                  label: '!text-gray-300 !text-3xl',
                  input:
                    '!bg-gray-700 !text-gray-100 placeholder:!text-gray-400 focus:!border-blue-500',
                }}
              />
              {errors.incoming_products && (
                <p className='text-red-500 mt-1'>
                  {String(errors.incoming_products.message)}
                </p>
              )}
            </div>

            {/* Teclado Numérico */}
            <div className='mt-4'>
              <NumericKeyboard onKeyPress={handleKeyPress} />
            </div>
            <p className='mt-2 text-xs text-gray-100'>
              Producto: {product?.name}
            </p>
            {/* Action Buttons */}
            <div className='flex gap-4 space-y-6 pt-4'>
              <Button
                onPress={() => navigate('/entradas')}
                className='w-full h-12 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 transition-all duration-200'
                radius='lg'
                isDisabled={mutation.isPending}
              >
                <span className='text-gray-300 font-medium text-sm'>
                  Cancelar
                </span>
              </Button>
              <Button
                type='submit'
                isLoading={mutation.isPending}
                disabled={mutation.isPending}
                className='w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-200'
                radius='lg'
              >
                <span className='text-white font-semibold text-sm'>
                  {mutation.isPending
                    ? 'Actualizando...'
                    : 'Actualizar Entradas'}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
