import React, { useState } from 'react';
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
import {
  ArrowLeftIcon,
  CubeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import {
  ArrowLeftIcon as ArrowLeftIconSolid,
  CubeIcon as CubeIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
} from '@heroicons/react/24/solid';

const CreateProductForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      cost: 0,
      price: 0,
      unit: '',
    },
  });

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showQuickTips, setShowQuickTips] = useState(false);

  const navigate = useNavigate();
  const { mutation } = useGenericMutation(productdb.add, ['product-list']);

  const watchedCost = watch('cost');
  const watchedPrice = watch('price');
  const watchedName = watch('name');
  const watchedUnit = watch('unit');

  const calculateMargin = () => {
    if (!watchedCost || !watchedPrice || watchedCost === 0) return 0;
    return ((watchedPrice - watchedCost) / watchedCost) * 100;
  };

  const margin = calculateMargin();
  const marginColor =
    margin >= 30
      ? 'text-emerald-400'
      : margin >= 15
        ? 'text-amber-400'
        : 'text-red-400';

  const getMarginIcon = () => {
    if (margin >= 30)
      return <ChartBarIconSolid className='w-5 h-5 text-emerald-400' />;
    if (margin >= 15)
      return <ChartBarIcon className='w-5 h-5 text-amber-400' />;
    return <ExclamationTriangleIconSolid className='w-5 h-5 text-red-400' />;
  };

  const getMarginLevel = () => {
    if (margin >= 30)
      return { label: 'Excelente', color: 'bg-emerald-500', icon: '📈' };
    if (margin >= 15)
      return { label: 'Aceptable', color: 'bg-amber-500', icon: '📊' };
    return { label: 'Bajo', color: 'bg-red-500', icon: '⚠️' };
  };

  const onSubmit = async (data: CreateProductFormData) => {
    try {
      const productData = mapFormDataToProduct(data);
      await mutation.mutateAsync(productData);
      toast.success('✅ Producto creado exitosamente', {
        style: {
          background: '#111318',
          color: '#fff',
          border: '1px solid #374151',
        },
        icon: <CheckCircleIcon className='w-5 h-5 text-emerald-400' />,
      });
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`❌ Error al crear el producto: ${errorMessage}`, {
        style: {
          background: '#111318',
          color: '#fff',
          border: '1px solid #374151',
        },
        icon: <XCircleIcon className='w-5 h-5 text-red-400' />,
      });
    }
  };

  React.useEffect(() => {
    if (mutation.isError) {
      const errorMessage =
        mutation.error instanceof Error
          ? mutation.error.message
          : 'Error desconocido';
      toast.error(`❌ Error: ${errorMessage}`, {
        style: {
          background: '#111318',
          color: '#fff',
          border: '1px solid #374151',
        },
        icon: <XCircleIcon className='w-5 h-5 text-red-400' />,
      });
    }
  }, [mutation.isError, mutation.error]);

  // Quick price suggestions based on cost
  const suggestPrice = (percentage: number) => {
    if (!watchedCost || watchedCost <= 0) {
      toast.error('Primero ingresa un costo válido', {
        icon: <ExclamationTriangleIcon className='w-5 h-5 text-amber-400' />,
      });
      return;
    }
    const suggestedPrice = watchedCost * (1 + percentage / 100);
    setValue('price', Number(suggestedPrice.toFixed(2)), {
      shouldValidate: true,
    });
  };

  const handleClearForm = () => {
    reset();
    setShowAnalysis(false);
    toast.success('Formulario limpiado', {
      icon: <CheckCircleIcon className='w-5 h-5 text-emerald-400' />,
    });
  };

  const isFormValid =
    watchedName && watchedUnit && watchedCost > 0 && watchedPrice > 0;

  return (
    <div className='min-h-screen w-full bg-[#0d0f12] text-gray-100 px-4 py-6 md:py-8 animate-fade-in'>
      {/* Header Mobile */}
      <div className='md:hidden mb-6 flex items-center justify-between'>
        <button
          onClick={() => navigate('/')}
          className='flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors p-2 hover:bg-gray-800/60 rounded-lg'
        >
          <ArrowLeftIcon className='w-5 h-5' />
          <span className='text-sm font-medium'>Volver</span>
        </button>
        <div className='flex items-center gap-2'>
          <CubeIcon className='w-6 h-6 text-emerald-400' />
          <h1 className='text-lg font-bold'>Nuevo Producto</h1>
        </div>
        <div className='w-10' />
      </div>

      <div className='max-w-2xl mx-auto'>
        {/* Desktop Header */}
        <div className='hidden md:flex items-center justify-between mb-8'>
          <button
            onClick={() => navigate('/')}
            className='flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors p-3 hover:bg-gray-800/60 rounded-xl transition-all duration-300'
          >
            <ArrowLeftIconSolid className='w-5 h-5' />
            <span className='text-sm font-medium'>Volver a Productos</span>
          </button>

          <div className='flex items-center gap-3'>
            <div className='p-3 bg-emerald-400/10 rounded-xl'>
              <CubeIconSolid className='w-7 h-7 text-emerald-400' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>Crear Nuevo Producto</h1>
              <p className='text-gray-400 text-sm'>
                Complete todos los campos requeridos
              </p>
            </div>
          </div>

          <button
            onClick={handleClearForm}
            className='flex items-center gap-2 text-gray-400 hover:text-amber-400 p-3 hover:bg-gray-800/60 rounded-xl transition-all duration-300'
          >
            <ArrowLeftIcon className='w-5 h-5' />
            <span className='text-sm font-medium'>Limpiar</span>
          </button>
        </div>

        {/* Main Form Card */}
        <div className='bg-[#111318] border border-gray-800 rounded-2xl shadow-xl shadow-black/30 p-6 transition-all duration-300 mb-6'>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* === SECCIÓN 1: INPUTS CONTINUOS === */}
            <div className='space-y-6'>
              {/* Nombre del Producto */}
              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-medium text-gray-300'>
                  <CubeIcon className='w-4 h-4 text-emerald-400' />
                  Nombre del Producto
                  <span className='text-red-400'>*</span>
                </label>
                <Input
                  {...register('name')}
                  placeholder='Ej: Laptop Dell XPS 13'
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
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                />
              </div>

              {/* Unidad de Medida */}
              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-medium text-gray-300'>
                  <ScaleIcon className='w-4 h-4 text-blue-400' />
                  Unidad de Medida
                  <span className='text-red-400'>*</span>
                </label>
                <Input
                  {...register('unit')}
                  placeholder='Ej: unidad, kg, litro, caja'
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
                  isInvalid={!!errors.unit}
                  errorMessage={errors.unit?.message}
                />
              </div>

              {/* Precio de Costo */}
              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-medium text-gray-300'>
                  <CurrencyDollarIcon className='w-4 h-4 text-amber-400' />
                  Precio de Costo
                  <span className='text-red-400'>*</span>
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
                    $
                  </span>
                  <Input
                    type='number'
                    step='0.01'
                    min='0'
                    {...register('cost', { valueAsNumber: true })}
                    placeholder='0.00'
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
                    isInvalid={!!errors.cost}
                    errorMessage={errors.cost?.message}
                  />
                </div>
              </div>

              {/* Precio de Venta */}
              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-medium text-gray-300'>
                  <CurrencyDollarIconSolid className='w-4 h-4 text-amber-400' />
                  Precio de Venta
                  <span className='text-red-400'>*</span>
                </label>
                <div className='space-y-3'>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
                      $
                    </span>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      {...register('price', { valueAsNumber: true })}
                      placeholder='0.00'
                      classNames={{
                        label: '!text-gray-300 !text-sm !font-medium',
                        input:
                          '!text-gray-100 !text-base !placeholder-gray-500',
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
                      isInvalid={!!errors.price}
                      errorMessage={errors.price?.message}
                    />
                  </div>

                  {/* Quick Suggestions (minimal) */}
                  {watchedCost > 0 && (
                    <div className='flex gap-2'>
                      {[15, 30, 50].map((percent) => (
                        <button
                          key={percent}
                          type='button'
                          onClick={() => suggestPrice(percent)}
                          className='flex-1 text-xs bg-gray-800/60 hover:bg-gray-700 border border-gray-700 hover:border-amber-500/40 text-gray-300 hover:text-amber-400 py-2 rounded-lg transition-all duration-300'
                        >
                          +{percent}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* === SECCIÓN 2: BOTONES DE ACCIÓN === */}
            <div className='pt-8 mt-8 border-t border-gray-800 space-y-4'>
              <div className='flex flex-col sm:flex-row gap-3'>
                <Button
                  type='submit'
                  isLoading={isSubmitting || mutation.isPending}
                  className='py-2 flex-1 bg-amber-600 hover:bg-amber-700 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-amber-500/40 transform hover:scale-105 transition-all duration-300 h-12 flex items-center justify-center gap-2'
                  isDisabled={!isFormValid}
                >
                  {isSubmitting || mutation.isPending ? (
                    <>
                      <div className='w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin' />
                      Creando Producto...
                    </>
                  ) : (
                    <>
                      <CubeIcon className='w-5 h-5' />
                      Crear Producto
                    </>
                  )}
                </Button>

                <Button
                  type='button'
                  onPress={() => navigate('/')}
                  isDisabled={isSubmitting || mutation.isPending}
                  className='py-2 flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-xl hover:border-gray-600 transition-all duration-300 h-12 flex items-center justify-center gap-2'
                >
                  <ArrowLeftIcon className='w-4 h-4' />
                  Cancelar
                </Button>
              </div>

              <p className='text-xs text-gray-500 text-center'>
                Los campos marcados con <span className='text-red-400'>*</span>{' '}
                son requeridos
              </p>
            </div>
          </form>
        </div>

        {/* === SECCIÓN 3: INFORMACIÓN ADICIONAL (Dropdowns) === */}

        {/* Dropdown 1: Análisis de Margen */}
        <div className='mb-6'>
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className='w-full flex items-center justify-between p-4 bg-[#111318] border border-gray-800 rounded-2xl hover:bg-gray-800/30 transition-all duration-300'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-emerald-400/10 rounded-lg'>
                <ChartBarIcon className='w-5 h-5 text-emerald-400' />
              </div>
              <div className='text-left'>
                <h3 className='font-semibold text-gray-100'>
                  Análisis de Rentabilidad
                </h3>
                <p className='text-sm text-gray-400'>
                  Ver margen y recomendaciones
                </p>
              </div>
            </div>
            {showAnalysis ? (
              <ChevronUpIcon className='w-5 h-5 text-gray-400' />
            ) : (
              <ChevronDownIcon className='w-5 h-5 text-gray-400' />
            )}
          </button>

          {showAnalysis && (
            <div className='mt-2 bg-[#111318] border border-gray-800 rounded-2xl p-6 animate-fade-in'>
              {isFormValid ? (
                <div className='space-y-6'>
                  {/* Margin Summary */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-[#0d0f12] border border-gray-800 rounded-xl p-4'>
                      <div className='flex items-center justify-between mb-2'>
                        <p className='text-sm text-gray-400'>
                          Margen de Ganancia
                        </p>
                        {getMarginIcon()}
                      </div>
                      <p className={`text-3xl font-bold ${marginColor}`}>
                        {margin.toFixed(1)}%
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        Nivel: {getMarginLevel().label}
                      </p>
                    </div>

                    <div className='bg-[#0d0f12] border border-gray-800 rounded-xl p-4'>
                      <p className='text-sm text-gray-400 mb-2'>
                        Ganancia por Unidad
                      </p>
                      <p className='text-3xl font-bold text-gray-100'>
                        ${(watchedPrice - watchedCost).toFixed(2)}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        Por cada {watchedUnit || 'unidad'} vendida
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-400'>Bajo</span>
                      <span className='text-gray-400'>Excelente</span>
                    </div>
                    <div className='h-2 bg-gray-800 rounded-full overflow-hidden'>
                      <div
                        className={`h-full transition-all duration-700 ${getMarginLevel().color}`}
                        style={{ width: `${Math.min(margin, 50)}%` }}
                      />
                    </div>
                    <div className='flex justify-between text-xs text-gray-500'>
                      <span>0%</span>
                      <span>15%</span>
                      <span>30%</span>
                      <span>50%+</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {margin < 15 ? (
                    <div className='p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl'>
                      <div className='flex items-start gap-3'>
                        <ExclamationTriangleIconSolid className='w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5' />
                        <div>
                          <p className='text-sm font-medium text-amber-300 mb-1'>
                            Margen bajo detectado
                          </p>
                          <p className='text-xs text-amber-400/80'>
                            Para un margen saludable de 30%, considera un precio
                            de:
                            <span className='font-bold ml-1 text-amber-300'>
                              ${(watchedCost * 1.3).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl'>
                      <div className='flex items-start gap-3'>
                        <CheckCircleIcon className='w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5' />
                        <div>
                          <p className='text-sm font-medium text-emerald-300 mb-1'>
                            Margen saludable
                          </p>
                          <p className='text-xs text-emerald-400/80'>
                            El margen actual es adecuado para este producto.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <CalculatorIcon className='w-12 h-12 text-gray-700 mx-auto mb-3' />
                  <p className='text-gray-400'>
                    Completa todos los campos para ver el análisis de
                    rentabilidad
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dropdown 2: Consejos y Buenas Prácticas */}
        <div>
          <button
            onClick={() => setShowQuickTips(!showQuickTips)}
            className='w-full flex items-center justify-between p-4 bg-[#111318] border border-gray-800 rounded-2xl hover:bg-gray-800/30 transition-all duration-300'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-400/10 rounded-lg'>
                <InformationCircleIcon className='w-5 h-5 text-blue-400' />
              </div>
              <div className='text-left'>
                <h3 className='font-semibold text-gray-100'>
                  Consejos y Buenas Prácticas
                </h3>
                <p className='text-sm text-gray-400'>
                  Guía para precios óptimos
                </p>
              </div>
            </div>
            {showQuickTips ? (
              <ChevronUpIcon className='w-5 h-5 text-gray-400' />
            ) : (
              <ChevronDownIcon className='w-5 h-5 text-gray-400' />
            )}
          </button>

          {showQuickTips && (
            <div className='mt-2 bg-[#111318] border border-gray-800 rounded-2xl p-6 animate-fade-in'>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className='w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0' />
                  <div>
                    <p className='font-medium text-gray-300'>
                      Margen Recomendado
                    </p>
                    <p className='text-sm text-gray-500'>
                      Para la mayoría de productos, un margen del 30% o más es
                      ideal. Considera costos adicionales como transporte,
                      almacenamiento y marketing.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <div className='w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0' />
                  <div>
                    <p className='font-medium text-gray-300'>
                      Nombres Descriptivos
                    </p>
                    <p className='text-sm text-gray-500'>
                      Usa nombres claros que incluyan marca, modelo y
                      características principales. Ej: "Laptop Dell XPS 13 - i7
                      16GB 512GB SSD" en lugar de solo "Laptop".
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <div className='w-2 h-2 bg-blue-400 rounded-full mt=2 flex-shrink-0' />
                  <div>
                    <p className='font-medium text-gray-300'>
                      Unidades Consistentes
                    </p>
                    <p className='text-sm text-gray-500'>
                      Mantén las mismas unidades para productos similares. Si
                      usas "kg" para un producto, no uses "gramos" para otro
                      similar.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <div className='w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0' />
                  <div>
                    <p className='font-medium text-gray-300'>
                      Revisión de Precios
                    </p>
                    <p className='text-sm text-gray-500'>
                      Revisa regularmente los precios de la competencia y ajusta
                      según sea necesario. Los precios de insumos pueden cambiar
                      con el tiempo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Card (solo en desktop) */}
        <div className='hidden md:block mt-6 bg-[#111318] border border-gray-800 rounded-2xl shadow-xl shadow-black/30 p-6'>
          <h3 className='text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2'>
            <CubeIcon className='w-5 h-5 text-emerald-400' />
            Vista Previa del Producto
          </h3>

          {isFormValid ? (
            <div className='space-y-4'>
              <div className='bg-[#0d0f12] border border-gray-800 rounded-xl p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-semibold text-gray-100 truncate'>
                    {watchedName}
                  </h4>
                  <span className='text-xs font-medium text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full'>
                    {watchedUnit}
                  </span>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-400'>Costo:</span>
                    <span className='text-gray-300 font-medium'>
                      ${watchedCost.toFixed(2)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-400'>Precio:</span>
                    <span className='text-gray-100 font-bold'>
                      ${watchedPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center pt-2 border-t border-gray-800'>
                    <span className='text-sm text-gray-400'>Ganancia:</span>
                    <span className={`font-bold ${marginColor}`}>
                      +${(watchedPrice - watchedCost).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <p className='text-xs text-gray-500 text-center'>
                Así aparecerá en el listado de productos
              </p>
            </div>
          ) : (
            <div className='text-center py-8'>
              <CubeIcon className='w-12 h-12 text-gray-700 mx-auto mb-3' />
              <p className='text-gray-400 text-sm'>
                Completa el formulario para ver la vista previa
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProductForm;
