import React, { useEffect, useRef } from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  DocumentDuplicateIcon,
  CalculatorIcon,
  XMarkIcon,
  ArrowPathIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';

interface NegativeValueError {
  productCode: string;
  field: string;
  originalValue: number;
  absoluteValue: number;
}

interface NegativeValuesModalProps {
  open: boolean;
  errors: NegativeValueError[];
  onConfirm: (action: 'abs' | 'zero') => void;
  onCancel: () => void;
}

const NegativeValuesModal: React.FC<NegativeValuesModalProps> = ({
  open,
  errors,
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onCancel]);

  // Contador por campo
  const errorCounts = errors.reduce(
    (acc, error) => {
      acc[error.field] = (acc[error.field] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Contador por producto
  const productCounts = errors.reduce(
    (acc, error) => {
      acc[error.productCode] = (acc[error.productCode] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Mapear nombres de campos a español
  const fieldNames: Record<string, string> = {
    cost: 'Costo',
    price: 'Precio',
    initial_products: 'Productos Iniciales',
    incoming_products: 'Productos Entrantes',
    losses: 'Pérdidas',
    final_products: 'Productos Finales',
    id: 'ID',
  };

  // Formatear valor
  const formatValue = (value: number) => {
    return value.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Manejar clic fuera del modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onCancel();
    }
  };

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className='w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200'
      >
        {/* Header */}
        <div className='p-6 border-b border-gray-800'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 bg-red-500/10 rounded-lg'>
              <ExclamationTriangleIcon className='w-6 h-6 text-red-400' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300'>
                Valores Negativos Detectados
              </h2>
              <p className='text-sm text-gray-400 mt-1'>
                Se encontraron {errors.length} valores negativos que requieren
                corrección
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          {/* Resumen estadístico */}
          <div className='grid grid-cols-2 gap-3 mb-6'>
            <div className='bg-red-500/10 border border-red-500/20 rounded-xl p-3'>
              <div className='flex items-center gap-2 mb-1'>
                <DocumentDuplicateIcon className='w-4 h-4 text-red-400' />
                <div className='text-xs text-red-400 font-medium'>
                  Productos afectados
                </div>
              </div>
              <div className='text-lg font-bold text-red-300'>
                {Object.keys(productCounts).length}
              </div>
              <div className='text-xs text-red-400/70 truncate mt-1'>
                {Object.keys(productCounts).slice(0, 3).join(', ')}
                {Object.keys(productCounts).length > 3 && '...'}
              </div>
            </div>

            <div className='bg-orange-500/10 border border-orange-500/20 rounded-xl p-3'>
              <div className='flex items-center gap-2 mb-1'>
                <CalculatorIcon className='w-4 h-4 text-orange-400' />
                <div className='text-xs text-orange-400 font-medium'>
                  Campos con errores
                </div>
              </div>
              <div className='text-lg font-bold text-orange-300'>
                {Object.keys(errorCounts).length}
              </div>
              <div className='text-xs text-orange-400/70 mt-1 space-y-0.5'>
                {Object.entries(errorCounts)
                  .slice(0, 2)
                  .map(([field, count]) => (
                    <div key={field} className='flex justify-between'>
                      <span>{fieldNames[field] || field}:</span>
                      <span className='font-medium'>{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Lista de errores */}
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-gray-300 font-medium flex items-center gap-2'>
                <InformationCircleIcon className='w-5 h-5 text-gray-400' />
                Detalles de los valores negativos
              </h3>
              <span className='text-xs text-gray-500'>
                Mostrando {Math.min(errors.length, 10)} de {errors.length}
              </span>
            </div>

            <div className='max-h-64 overflow-y-auto bg-gray-900/50 rounded-lg border border-gray-700/30 p-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'>
              {errors.slice(0, 10).map((error, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors border-b border-gray-800/30 last:border-b-0'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center'>
                      <XMarkIcon className='w-5 h-5 text-red-400' />
                    </div>
                    <div>
                      <div className='font-medium text-gray-200'>
                        {error.productCode}
                      </div>
                      <div className='text-sm text-gray-400'>
                        {fieldNames[error.field] || error.field}
                      </div>
                    </div>
                  </div>

                  <div className='text-right'>
                    <div className='text-red-400 font-mono font-medium'>
                      {formatValue(error.originalValue)}
                    </div>
                    <div className='text-xs text-gray-500 flex items-center gap-1 justify-end'>
                      <ArrowPathIcon className='w-3 h-3' />
                      Valor absoluto: {formatValue(error.absoluteValue)}
                    </div>
                  </div>
                </div>
              ))}

              {errors.length > 10 && (
                <div className='text-center py-3 text-sm text-gray-500 border-t border-gray-800/30 mt-2'>
                  + {errors.length - 10} errores adicionales...
                </div>
              )}
            </div>
          </div>

          {/* Opciones de corrección */}
          <div className='mb-6'>
            <h3 className='text-gray-300 font-medium mb-3'>
              ¿Cómo desea corregir estos valores?
            </h3>

            <div className='space-y-3'>
              {/* Opción 1: Convertir a Cero */}
              <div
                className='group bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-700/50 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]'
                onClick={() => onConfirm('zero')}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors'>
                      <NoSymbolIcon className='w-6 h-6 text-blue-400' />
                    </div>
                    <div>
                      <div className='font-medium text-gray-200 group-hover:text-gray-100'>
                        Convertir a Cero
                      </div>
                      <div className='text-sm text-gray-400 group-hover:text-gray-300'>
                        Todos los valores negativos se establecerán en 0
                      </div>
                    </div>
                  </div>
                  <div className='text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded'>
                    RECOMENDADO
                  </div>
                </div>
              </div>

              {/* Opción 2: Valor Absoluto */}
              <div
                className='group bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-700/50 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]'
                onClick={() => onConfirm('abs')}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors'>
                      <ArrowPathIcon className='w-6 h-6 text-green-400' />
                    </div>
                    <div>
                      <div className='font-medium text-gray-200 group-hover:text-gray-100'>
                        Convertir a Positivo
                      </div>
                      <div className='text-sm text-gray-400 group-hover:text-gray-300'>
                        Los valores negativos se convertirán a su valor absoluto
                      </div>
                    </div>
                  </div>
                  <div className='text-xs text-gray-500'>Ej: -10.5 → 10.5</div>
                </div>
              </div>
            </div>
          </div>

          {/* Advertencia */}
          <div className='bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4'>
            <div className='flex items-start gap-3'>
              <ExclamationTriangleIcon className='w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0' />
              <div>
                <div className='text-yellow-300 font-medium mb-1'>
                  Importante
                </div>
                <div className='text-sm text-yellow-400/80'>
                  Los valores negativos pueden causar inconsistencias en los
                  cálculos del inventario. Es necesario corregirlos antes de
                  exportar.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className='p-6 border-t border-gray-800'>
          <div className='flex flex-col sm:flex-row gap-3'>
            <button
              onClick={onCancel}
              className='flex-1 h-12 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors duration-300 rounded-xl font-medium border border-gray-700/50 flex items-center justify-center gap-2'
            >
              <XCircleIcon className='w-5 h-5' />
              Cancelar Exportación
            </button>

            <div className='flex gap-3'>
              <button
                onClick={() => onConfirm('abs')}
                className='h-12 px-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border border-yellow-500/20 text-gray-300 transition-all duration-300 rounded-xl font-medium flex items-center justify-center gap-2'
              >
                <ArrowPathIcon className='w-5 h-5' />
                Valor Absoluto
              </button>

              <button
                onClick={() => onConfirm('zero')}
                className='h-12 px-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2'
              >
                <CheckCircleIcon className='w-5 h-5' />
                Convertir a Cero
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegativeValuesModal;
