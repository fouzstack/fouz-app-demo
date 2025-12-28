import { useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import NumericKeyboard from '../numericKeyboard/NumericKeyboard';
import { useInventoryMutation } from '../table-updater/useInventoryMutation';
import { LossesUpdateFormData } from './losses.schema';
import { useLossesAjustment } from './useLossesAdjusment';

export default function LossesAjustmentModal() {
  const navigate = useNavigate();
  const {
    errors,
    handleSubmit,
    finalProducts,
    setValue,
    watch,
    product,
    isValid,
    maxAllowed,
    sold,
  } = useLossesAjustment();

  const mutation = useInventoryMutation(product?.id || 0);
  const lossesValue = watch('losses', 0);
  const [lossesInput, setLossesInput] = useState(lossesValue.toString());
  const [showValidationInfo, setShowValidationInfo] = useState(false);

  // Sincronización entre el valor del formulario y el estado local
  useEffect(() => {
    setLossesInput(lossesValue.toString());
  }, [lossesValue]);

  const handleKeyPress = (
    key: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    let newValue: string;

    if (key === 'del') {
      const newInputValue = lossesInput.slice(0, -1);
      newValue = newInputValue === '' ? '0' : newInputValue;
    } else if (key === '.' && !lossesInput.includes('.')) {
      newValue = lossesInput + '.';
    } else if (key !== '.') {
      newValue = lossesInput === '0' ? key : lossesInput + key;
    } else {
      newValue = lossesInput;
    }

    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue)) {
      setLossesInput(newValue);
      setValue('losses', numericValue, { shouldValidate: true });
    }
  };

  const handleInputChange = (value: string) => {
    // Permitir solo números y punto decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setLossesInput(value);
      const numericValue = value === '' ? 0 : parseFloat(value);
      if (!isNaN(numericValue)) {
        setValue('losses', numericValue, { shouldValidate: true });
      }
    }
  };

  const onSubmit = async (data: LossesUpdateFormData) => {
    if (!isValid) {
      toast.error('Por favor corrige los errores antes de enviar');
      return;
    }

    if (!product) {
      toast.error('No se encontró el producto');
      return;
    }

    // Validación adicional antes de enviar
    if (data.losses < 0) {
      toast.error('Las pérdidas no pueden ser negativas');
      return;
    }

    if (data.losses > maxAllowed) {
      toast.error(`Las pérdidas no pueden exceder ${maxAllowed.toFixed(2)}`);
      return;
    }

    if (finalProducts < 0) {
      toast.error('El stock final no puede ser negativo');
      return;
    }

    try {
      await mutation.mutateAsync({
        losses: data.losses,
        final_products: finalProducts,
        incoming_products: product.incoming_products || 0,
        initial_products: product.initial_products || 0,
      });

      toast.success('Pérdidas actualizadas correctamente');
      setTimeout(() => navigate('/ajustes'), 1000);
    } catch (error) {
      console.error('Error en actualización:', error);
      toast.error('Error al actualizar las pérdidas');
    }
  };

  if (!product) {
    return (
      <div className='w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 px-4 py-2'>
        <div className='text-red-400 text-lg'>No hay producto seleccionado</div>
        <Button
          onPress={() => navigate('/ajustes')}
          className='mt-4 bg-gray-700 hover:bg-gray-600'
        >
          Volver
        </Button>
      </div>
    );
  }

  const stockTotal =
    (product.initial_products || 0) + (product.incoming_products || 0);
  const currentLosses = product.losses || 0;
  const currentFinal = product.final_products || 0;

  // Determinar si el valor actual es válido
  const isCurrentValueValid =
    lossesValue >= 0 && lossesValue <= maxAllowed && finalProducts >= 0;

  return (
    <div className='w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 px-4 py-2 min-h-screen'>
      <Toaster position='top-center' />

      <div className='max-w-xl w-full space-y-4'>
        <div className='bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700/50'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Input de Pérdidas */}
            <div className='space-y-2'>
              <Input
                color={
                  errors.losses
                    ? 'danger'
                    : isCurrentValueValid
                      ? 'success'
                      : 'default'
                }
                variant='underlined'
                value={lossesInput}
                onChange={(e) => handleInputChange(e.target.value)}
                label='Nuevas Pérdidas'
                type='text'
                inputMode='none'
                placeholder={`Máximo permitido: ${maxAllowed.toFixed(2)}`}
                classNames={{
                  label: '!text-gray-300',
                  input: `!bg-gray-700 text-xl !text-gray-100 placeholder:!text-gray-400 ${
                    errors.losses
                      ? 'focus:!border-red-500'
                      : isCurrentValueValid
                        ? 'focus:!border-green-500'
                        : 'focus:!border-orange-500'
                  }`,
                }}
                isInvalid={!!errors.losses}
                errorMessage={errors.losses?.message}
              />

              {/* Teclado Numérico */}
              <div className='mt-6'>
                <NumericKeyboard onKeyPress={handleKeyPress} />
              </div>

              <p className='text-sm text-gray-100 text-center py-2 border-t border-gray-700/50'>
                Producto:{' '}
                <strong className='text-orange-300'>{product.name}</strong>
              </p>

              {/* Botones de Acción */}
              <div className='flex gap-4 pt-4'>
                <Button
                  onPress={() => navigate('/ajustes')}
                  className='w-full h-12 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 transition-all duration-200'
                  radius='lg'
                  isDisabled={mutation.isPending}
                >
                  <span className='text-gray-300 font-medium'>Cancelar</span>
                </Button>
                <Button
                  type='submit'
                  isDisabled={
                    mutation.isPending || !isValid || !isCurrentValueValid
                  }
                  className={`w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 shadow-lg transition-all duration-200 ${
                    mutation.isPending || !isValid || !isCurrentValueValid
                      ? 'opacity-50 cursor-not-allowed'
                      : 'shadow-orange-500/25 hover:shadow-orange-500/40'
                  }`}
                  radius='lg'
                >
                  <span className='text-white font-semibold'>
                    {mutation.isPending ? 'Actualizando...' : 'Actualizar'}
                  </span>
                </Button>
              </div>

              {/* Información de validación adicional - CON ACORDEÓN MODERNO */}
              <div className='border border-gray-600/30 rounded-xl overflow-hidden bg-gray-800/50'>
                <button
                  type='button'
                  onClick={() => setShowValidationInfo(!showValidationInfo)}
                  className='w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700/30 transition-all duration-300 group'
                >
                  <span className='text-sm font-medium text-gray-300 group-hover:text-white transition-colors'>
                    Detalles de validación
                  </span>
                  <div className='flex items-center'>
                    <span className='text-xs text-gray-400 mr-2 group-hover:text-gray-300'>
                      {showValidationInfo ? 'Ocultar' : 'Mostrar'}
                    </span>
                    <div
                      className={`transform transition-transform duration-300 ${showValidationInfo ? 'rotate-180' : 'rotate-0'}`}
                    >
                      <svg
                        className='w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 9l-7 7-7-7'
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Render condicional del contenido */}
                {showValidationInfo && (
                  <div className='px-4 pb-3 animate-fadeIn'>
                    {!errors.losses && !isCurrentValueValid && (
                      <div className='text-xs text-orange-400 mt-1 space-y-1'>
                        {lossesValue < 0 && (
                          <div className='flex items-center'>
                            <span className='w-2 h-2 bg-red-500 rounded-full mr-2'></span>
                            Las pérdidas no pueden ser negativas
                          </div>
                        )}
                        {lossesValue > maxAllowed && (
                          <div className='flex items-center'>
                            <span className='w-2 h-2 bg-red-500 rounded-full mr-2'></span>
                            Máximo permitido: {maxAllowed.toFixed(2)}
                          </div>
                        )}
                        {finalProducts < 0 && (
                          <div className='flex items-center'>
                            <span className='w-2 h-2 bg-red-500 rounded-full mr-2'></span>
                            El stock final no puede ser negativo
                          </div>
                        )}
                      </div>
                    )}
                    {isCurrentValueValid && (
                      <div className='text-xs text-green-400 flex items-center'>
                        <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                        Todos los valores son válidos
                      </div>
                    )}
                  </div>
                )}
              </div>

              {showValidationInfo && (
                <div>
                  {/* Resultado del Ajuste */}
                  <div className='bg-gray-700/30 rounded-lg p-4 border border-gray-600/50'>
                    <h3 className='text-gray-300 font-semibold mb-3 text-center'>
                      Resultado del Ajuste
                    </h3>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div className='text-center'>
                        <p className='text-gray-400'>Nuevas Pérdidas</p>
                        <p
                          className={`font-semibold text-lg ${
                            lossesValue > maxAllowed || lossesValue < 0
                              ? 'text-red-400'
                              : 'text-red-400'
                          }`}
                        >
                          {lossesValue.toFixed(2)}
                        </p>
                        <p
                          className={`text-xs ${
                            lossesValue > currentLosses
                              ? 'text-red-300'
                              : lossesValue < currentLosses
                                ? 'text-green-300'
                                : 'text-gray-400'
                          }`}
                        >
                          {lossesValue > currentLosses
                            ? '↑ Aumentan'
                            : lossesValue < currentLosses
                              ? '↓ Disminuyen'
                              : 'Sin cambio'}
                        </p>
                      </div>
                      <div className='text-center'>
                        <p className='text-gray-400'>Nuevo Stock Final</p>
                        <p
                          className={`font-semibold text-lg ${
                            finalProducts < 0
                              ? 'text-red-400'
                              : 'text-green-400'
                          }`}
                        >
                          {finalProducts.toFixed(2)}
                        </p>
                        <p
                          className={`text-xs ${
                            finalProducts < 0
                              ? 'text-red-300'
                              : finalProducts < currentFinal
                                ? 'text-red-300'
                                : finalProducts > currentFinal
                                  ? 'text-green-300'
                                  : 'text-gray-400'
                          }`}
                        >
                          {finalProducts < 0
                            ? '❌ Inválido'
                            : finalProducts < currentFinal
                              ? '↓ Disminuye'
                              : finalProducts > currentFinal
                                ? '↑ Aumenta'
                                : 'Sin cambio'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información Completa del Sistema */}
                  <div className='bg-gray-900/50 rounded-xl p-4 border border-gray-700/30'>
                    <div className='grid grid-cols-2 gap-4 text-sm mb-3'>
                      <div className='text-center'>
                        <p className='text-gray-400'>Stock Total</p>
                        <p className='text-blue-400 font-semibold text-lg'>
                          {stockTotal.toFixed(2)}
                        </p>
                      </div>
                      <div className='text-center'>
                        <p className='text-gray-400'>Vendido (Fijo)</p>
                        <p className='text-purple-400 font-semibold text-lg'>
                          {sold.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div className='text-center'>
                        <p className='text-gray-400'>Pérdidas Actuales</p>
                        <p className='text-red-400 font-semibold'>
                          {currentLosses.toFixed(2)}
                        </p>
                      </div>
                      <div className='text-center'>
                        <p className='text-gray-400'>Final Actual</p>
                        <p className='text-green-400 font-semibold'>
                          {currentFinal.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className='mt-3 text-center text-xs text-gray-400'>
                      <p>
                        Máximo para pérdidas:{' '}
                        <strong className='text-orange-400'>
                          {maxAllowed.toFixed(2)}
                        </strong>
                      </p>
                      <p className='text-xs'>(Stock Total - Vendido)</p>
                    </div>
                  </div>

                  {/* Estado de Validación */}
                  {(!isValid || !isCurrentValueValid) && (
                    <div className='text-center'>
                      <p className='text-red-400 text-sm'>
                        {!isCurrentValueValid
                          ? 'Valores no permitidos - corrige los errores'
                          : 'Corrige los errores antes de enviar'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
