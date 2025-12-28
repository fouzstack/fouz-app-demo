import React, { useState } from 'react';
import { Button } from '@heroui/button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useInventoryStore } from '../../store/inventoryStore';
import inventory from '../../models/inventorydb';
import SellerForm from './SellerForm';
import { ACTION_TYPES } from '../../store/inventoryActions';
import { useUpdateInventorySeller } from '../../hooks/useUpdateInventorySeller';
import NegativeValuesModal from './NegativeValuesModal';

// Importar validador centralizado
import {
  prepareExportData,
  detectAllNegativeValues,
  correctNegativeValues,
  ExportJsonData,
  NegativeValueError,
} from './jsonValidator';

// Función para enviar JSON a Android
const sendJsonViaJsInterface = async (data: ExportJsonData): Promise<void> => {
  if (!window.AndroidInterface?.sendJsonToServer) {
    throw new Error('Interfaz Android no disponible');
  }

  try {
    window.AndroidInterface.sendJsonToServer(JSON.stringify(data));
    toast.success('Enviando a Android...', { duration: 1500 });
  } catch (error: any) {
    console.error('JSInterface error:', error);
    throw new Error(`Error Android: ${error.message || 'Error desconocido'}`);
  }
};

// Función para enviar JSON vía web (fallback)
const sendJsonViaFetch = async (data: ExportJsonData): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch('http://localhost:8080/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Timeout: servidor no respondió');
    }

    throw error;
  }
};

const ExportInventory: React.FC = () => {
  const navigate = useNavigate();
  const inventoryData = useInventoryStore((state) => state.inventory);
  const dispatch = useInventoryStore((state) => state.dispatch);
  const updateInventorySeller = useUpdateInventorySeller();

  const [showForm, setShowForm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [negativeErrors, setNegativeErrors] = useState<NegativeValueError[]>(
    [],
  );
  const [pendingCorrectedData, setPendingCorrectedData] =
    useState<ExportJsonData | null>(null);

  const onClickExport = () => setShowForm(true);

  const handleSellerSubmit = async (seller: string) => {
    if (isExporting) return;

    const trimmedSeller = seller.trim();
    if (!trimmedSeller) {
      toast.error('Introduzca un nombre de vendedor', { duration: 3000 });
      return;
    }

    setIsExporting(true);

    try {
      toast('Actualizando vendedor...', { duration: 2000 });

      // Actualizar vendedor en la base de datos
      await updateInventorySeller.mutateAsync(trimmedSeller);

      // Actualizar store global
      dispatch({
        type: ACTION_TYPES.SET_SELLER,
        payload: { ...inventoryData, seller: trimmedSeller },
      });

      setShowForm(false);
      toast('Preparando datos para exportar...', { duration: 2000 });

      // Obtener datos sin procesar
      const rawData = await inventory.getInventory();

      // 1. Detectar valores negativos (sin corregir todavía)
      const negatives = detectAllNegativeValues(rawData);

      if (negatives.length > 0) {
        setNegativeErrors(negatives);

        // 2. Preparar datos exportables (con correcciones a 0)
        const exportData = await prepareExportData(rawData, trimmedSeller);
        setPendingCorrectedData(exportData);

        setIsExporting(false);
        setModalOpen(true);
        return;
      }

      // 3. Si no hay negativos, preparar y exportar normalmente
      const exportData = await prepareExportData(rawData, trimmedSeller);
      await doExport(exportData);
    } catch (error: any) {
      console.error('Error en exportación:', error);
      toast.error(`Error: ${error.message || 'Error en exportación'}`, {
        duration: 2000,
        position: 'top-center',
      });
      setIsExporting(false);
    }
  };

  // Función principal de exportación (Android o Web)
  const doExport = async (exportData: ExportJsonData) => {
    let exportMethod = '';
    try {
      exportMethod = 'Android';
      await sendJsonViaJsInterface(exportData);
      toast.success('✅ Enviado a Android correctamente', { duration: 3000 });
    } catch (androidError) {
      console.log('Android falló, intentando vía web...');

      try {
        exportMethod = 'Web';
        toast('Android no disponible, usando conexión web...', {
          duration: 2000,
        });
        await sendJsonViaFetch(exportData);
        toast.success(`✅ Exportado vía ${exportMethod}`, { duration: 3000 });
      } catch (webError) {
        console.error('Error en exportación web:', webError);
        throw new Error(`Exportación falló: ${(webError as Error).message}`);
      }
    }

    // Mensaje de éxito final
    toast.success('¡Inventario exportado correctamente!', {
      duration: 3000,
      icon: '✅',
      style: {
        background: '#059669',
        color: 'white',
        fontWeight: 'bold',
      },
    });

    setIsExporting(false);
  };

  const handleModalConfirm = (action: 'abs' | 'zero') => {
    if (pendingCorrectedData) {
      // Aplicar corrección usando el validador centralizado
      const correctedData = correctNegativeValues(pendingCorrectedData, action);

      // Log de correcciones
      const correctionsCount = negativeErrors.length;
      console.log(
        `✅ ${correctionsCount} valores negativos corregidos a ${action === 'abs' ? 'positivos' : 'cero'}`,
      );

      toast.success(
        `${correctionsCount} valores corregidos a ${action === 'abs' ? 'positivos' : 'cero'}`,
        {
          duration: 2000,
        },
      );

      setModalOpen(false);
      setIsExporting(true);

      // Exportar datos corregidos
      doExport(correctedData);
    }
  };

  const handleModalCancel = () => {
    toast.error('Exportación cancelada. Revise los datos manualmente.', {
      duration: 3000,
    });
    setModalOpen(false);
  };

  const handleCancel = () => {
    if (!isExporting) setShowForm(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4 flex items-center justify-center'>
      <div className='w-full max-w-md'>
        <div className='bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden'>
          {/* Header */}
          <div className='p-6 border-b border-gray-800'>
            <div className='flex items-center justify-center gap-3 mb-2'>
              <div className='p-2 bg-blue-500/10 rounded-lg'>
                <svg
                  className='w-6 h-6 text-blue-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
                  />
                </svg>
              </div>
              <h1 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300'>
                Exportar Inventario
              </h1>
            </div>
            <p className='text-gray-400 text-center text-sm'>
              Genera un archivo JSON compatible con Android
            </p>
          </div>

          {/* Main Content */}
          <div className='p-6'>
            {!showForm ? (
              <div className='space-y-6'>
                {/* Export Button */}
                <Button
                  className='w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg rounded-xl shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
                  onPress={onClickExport}
                  isDisabled={isExporting}
                >
                  {isExporting ? (
                    <div className='flex items-center justify-center gap-3'>
                      <div className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full'></div>
                      <span>Exportando...</span>
                    </div>
                  ) : (
                    <div className='flex items-center justify-center gap-3'>
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2.5}
                          d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        />
                      </svg>
                      <span>Exportar Inventario</span>
                    </div>
                  )}
                </Button>

                {/* Info Panel */}
                <div className='bg-gray-800/50 rounded-xl p-4 border border-gray-700/50'>
                  <div className='flex items-start gap-3'>
                    <div className='mt-1'>
                      <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'></div>
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-gray-300 font-medium mb-2'>
                        Validaciones estrictas
                      </h3>
                      <ul className='text-gray-400 text-sm space-y-1'>
                        <li className='flex items-center gap-2'>
                          <div className='w-1 h-1 bg-red-500 rounded-full'></div>
                          <span className='text-red-300'>
                            ❌ NINGÚN campo puede ser negativo
                          </span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <div className='w-1 h-1 bg-green-500 rounded-full'></div>
                          <span>final_products puede ser null</span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <div className='w-1 h-1 bg-cyan-500 rounded-full'></div>
                          <span>Redondeo automático a 2 decimales</span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <div className='w-1 h-1 bg-yellow-500 rounded-full'></div>
                          <span>
                            Se notifican valores negativos antes de exportar
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Campos críticos */}
                  <div className='mt-4 pt-4 border-t border-gray-700/30'>
                    <div className='text-xs text-gray-500 mb-2'>
                      Campos que NO aceptan negativos:
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-2'>
                        <div className='text-xs text-red-400 font-medium'>
                          Monetarios
                        </div>
                        <div className='text-xs text-red-300'>cost, price</div>
                      </div>
                      <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-2'>
                        <div className='text-xs text-red-400 font-medium'>
                          Cantidades
                        </div>
                        <div className='text-xs text-red-300'>
                          initial, incoming
                        </div>
                      </div>
                      <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-2'>
                        <div className='text-xs text-red-400 font-medium'>
                          Pérdidas
                        </div>
                        <div className='text-xs text-red-300'>losses</div>
                      </div>
                      <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-2'>
                        <div className='text-xs text-red-400 font-medium'>
                          Final
                        </div>
                        <div className='text-xs text-red-300'>
                          final_products
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cancel Button */}
                <Button
                  onPress={() => navigate('/finales')}
                  className='w-full h-12 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors duration-300 rounded-xl font-medium border border-gray-700/50'
                  variant='flat'
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10 19l-7-7m0 0l7-7m-7 7h18'
                    />
                  </svg>
                  Volver atrás
                </Button>
              </div>
            ) : (
              <SellerForm
                onSubmit={handleSellerSubmit}
                onCancel={handleCancel}
                isSubmitting={isExporting}
              />
            )}
          </div>

          {/* Footer */}
          {isExporting && (
            <div className='px-6 pb-6'>
              <div className='bg-blue-500/10 border border-blue-500/20 rounded-xl p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full'></div>
                    <span className='text-blue-300 text-sm font-medium'>
                      Procesando exportación...
                    </span>
                  </div>
                  <span className='text-xs text-blue-400/70'>
                    No cerrar la app
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attribution */}
        <div className='mt-4 text-center'>
          <p className='text-xs text-gray-600'>
            Compatible con Android 5.0+ • Validación estricta sin negativos
          </p>
        </div>
      </div>

      {/* Modal de valores negativos */}
      <NegativeValuesModal
        open={modalOpen}
        errors={negativeErrors}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default ExportInventory;
