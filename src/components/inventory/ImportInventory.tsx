import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import inventory from '../../models/inventorydb';
import { InventoryType } from '../../models/models';
import { useInventoryStore } from '../../store/inventoryStore';
import { ACTION_TYPES } from '../../store/inventoryActions';

// Importar validador centralizado
import {
  cleanJsonText,
  repairJsonIfNeeded,
  validateImportData,
  transformToInventoryType,
  getFriendlyErrorMessage,
  //getValidationSummary,
  ExportJsonData,
} from './jsonValidator';

// Componente Modal de Confirmación
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  seller?: string;
  productCount?: number;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  seller,
  productCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
      <div className='w-full max-w-[300px] bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='p-5 border-b border-gray-800'>
          <div className='flex items-center justify-center gap-2 mb-3'>
            <div className='p-1.5 bg-amber-500/10 rounded-lg'>
              <svg
                className='w-5 h-5 text-amber-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <h2 className='text-xl font-bold text-gray-200'>{title}</h2>
          </div>

          {/* Mensaje principal */}
          <div className='text-center'>
            <p className='text-gray-300 text-sm mb-2'>{message}</p>

            {seller && (
              <div className='mb-3 p-2 bg-gray-800/50 rounded-lg border border-gray-700/30'>
                <p className='text-xs text-gray-400 mb-1'>Vendedor:</p>
                <p className='text-emerald-300 font-medium'>{seller}</p>
              </div>
            )}

            {productCount !== undefined && (
              <div className='mb-3 p-2 bg-gray-800/50 rounded-lg border border-gray-700/30'>
                <p className='text-xs text-gray-400 mb-1'>Productos:</p>
                <p className='text-amber-300 font-medium'>
                  {productCount} productos
                </p>
              </div>
            )}

            <p className='text-xs text-red-400 mt-3 font-medium'>
              ⚠️ Esta acción reemplazará TODO el inventario actual.
            </p>
          </div>
        </div>

        {/* Footer con botones */}
        <div className='p-4 flex gap-3'>
          <Button
            onPress={onClose}
            className='flex-1 h-11 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors duration-300 rounded-xl font-medium border border-gray-700/50'
            variant='flat'
          >
            Cancelar
          </Button>
          <Button
            onPress={onConfirm}
            className='flex-1 h-11 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:from-emerald-700 hover:to-green-600 transition-all duration-300'
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Componente Modal de Error
interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  errorDetails?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  errorDetails,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
      <div className='w-full max-w-[300px] bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-red-900/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='p-5 border-b border-red-900/30'>
          <div className='flex items-center justify-center gap-2 mb-3'>
            <div className='p-1.5 bg-red-500/10 rounded-lg'>
              <svg
                className='w-5 h-5 text-red-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h2 className='text-xl font-bold text-red-400'>{title}</h2>
          </div>

          {/* Mensaje principal */}
          <div className='text-center mb-4'>
            <p className='text-gray-300 text-sm mb-3'>{message}</p>

            {errorDetails && (
              <div className='mt-3 p-2 bg-gray-900/80 rounded-lg border border-gray-700 max-h-32 overflow-y-auto'>
                <pre className='text-xs text-red-300 font-mono whitespace-pre-wrap'>
                  {errorDetails}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer con botón */}
        <div className='p-4'>
          <Button
            onPress={onClose}
            className='w-full h-11 bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-colors duration-300 rounded-xl font-medium border border-red-700/30'
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

const ImportInventory: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { dispatch } = useInventoryStore();
  const [isImporting, setIsImporting] = useState(false);
  const [jsonPreview, setJsonPreview] = useState<string>('');

  // Estados para modales
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    message: string;
    seller?: string;
    productCount?: number;
    errorDetails?: string;
    validatedData?: ExportJsonData;
  }>({
    title: '',
    message: '',
  });

  // Mutation para guardar en la base de datos
  const importMutation = useMutation({
    mutationFn: async (inventoryData: InventoryType) => {
      // Reemplazar completamente el inventario
      await inventory.replaceInventory(inventoryData);
      return inventoryData;
    },
    onSuccess: (importedData) => {
      // Actualizar store global
      dispatch({
        type: ACTION_TYPES.SET_INVENTORY,
        payload: importedData,
      });

      // Invalidar queries de React Query
      queryClient.invalidateQueries({ queryKey: ['inventories'] });

      // Éxito
      toast.success('✅ Inventario importado correctamente', {
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#10b981',
          border: '1px solid #10b981',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#1f2937',
        },
      });

      // Navegar de vuelta
      setTimeout(() => navigate('/finales'), 1500);
    },
    onError: (error: any) => {
      setIsImporting(false);
      setShowErrorModal(true);
      setModalData({
        title: 'Error Importando',
        message:
          'Ocurrió un error al guardar el inventario en la base de datos.',
        errorDetails: error?.message || 'Error desconocido',
      });
    },
  });

  /**
   * Procesa JSON recibido desde Java usando el validador centralizado
   */
  const processJsonImport = async (jsonString: string) => {
    try {
      setIsImporting(true);
      setJsonPreview('');
      setShowConfirmModal(false);
      setShowErrorModal(false);

      console.log('🔍 Procesando JSON recibido:', {
        length: jsonString.length,
        preview: jsonString.substring(0, 100) + '...',
      });

      // 1. Limpiar JSON usando el validador centralizado
      const cleanedJson = cleanJsonText(jsonString);
      console.log('✅ JSON limpiado, longitud:', cleanedJson.length);

      // 2. Reparar si es necesario usando el validador centralizado
      const repairedText = repairJsonIfNeeded(cleanedJson);

      // 3. Parsear
      const rawData = JSON.parse(repairedText);
      console.log('✅ JSON parseado correctamente');

      // 4. Validar estructura usando el validador centralizado
      const validatedData = validateImportData(rawData);
      console.log('✅ JSON validado:', {
        seller: validatedData.seller,
        productsCount: validatedData.products.length,
      });

      // 5. Obtener resumen de validación
      //const summary = getValidationSummary(validatedData);

      // 6. Mostrar vista previa
      setJsonPreview(JSON.stringify(validatedData, null, 2).substring(0, 500));

      // 7. Mostrar modal de confirmación
      setModalData({
        title: 'Confirmar Importación',
        message: '¿Desea importar este inventario?',
        seller: validatedData.seller,
        productCount: validatedData.products.length,
        validatedData: validatedData,
      });
      setShowConfirmModal(true);
    } catch (error: any) {
      console.error('❌ Error procesando JSON:', error);
      setIsImporting(false);

      // Usar mensajes de error amigables del validador centralizado
      const friendlyError = getFriendlyErrorMessage(error);

      setShowErrorModal(true);
      setModalData({
        title: friendlyError.title,
        message: friendlyError.message,
        errorDetails: error.message,
      });

      // Mostrar vista previa del error para debugging
      setJsonPreview(
        `ERROR: ${error.message}\n\n${jsonString.substring(0, 300)}...`,
      );
    }
  };

  /**
   * Función para confirmar la importación
   */
  const handleConfirmImport = async () => {
    try {
      setShowConfirmModal(false);

      if (!modalData.validatedData) {
        throw new Error('Datos de importación no disponibles');
      }

      // Transformar a InventoryType usando el validador centralizado
      const inventoryData = transformToInventoryType(modalData.validatedData);

      // Guardar en base de datos
      await importMutation.mutateAsync(inventoryData);
    } catch (error: any) {
      console.error('❌ Error en confirmación de importación:', error);
      setIsImporting(false);
      setShowErrorModal(true);
      setModalData({
        title: 'Error en Importación',
        message: 'Ocurrió un error al procesar la importación.',
        errorDetails: error?.message || 'Error desconocido',
      });
    }
  };

  /**
   * Configurar listener para JSON desde Java
   */
  useEffect(() => {
    window.useJsonData = async (jsonString: string) => {
      console.log('📥 useJsonData llamado desde Java con JSON');
      await processJsonImport(jsonString);
    };

    // Limpiar al desmontar
    return () => {
      delete window.useJsonData;
    };
  }, []);

  /**
   * Abrir selector de archivos nativo de Android
   */
  const handleOpenFileSelector = () => {
    if (window.AndroidInterface?.openFileSelector) {
      console.log('📁 Llamando a AndroidInterface.openFileSelector()');
      window.AndroidInterface.openFileSelector();
    } else {
      setShowErrorModal(true);
      setModalData({
        title: 'Interfaz No Disponible',
        message: 'La interfaz Android no está disponible en este momento.',
        errorDetails: 'AndroidInterface.openFileSelector() no está definido',
      });
    }
  };

  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4 flex items-center justify-center'>
        <div className='w-full max-w-md'>
          <div className='bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden'>
            {/* Header */}
            <div className='p-6 border-b border-gray-800'>
              <div className='flex items-center justify-center gap-3 mb-2'>
                <div className='p-2 bg-emerald-500/10 rounded-lg'>
                  <svg
                    className='w-6 h-6 text-emerald-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                    />
                  </svg>
                </div>
                <h1 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300'>
                  Importar Inventario
                </h1>
              </div>
              <p className='text-gray-400 text-center text-sm'>
                Importa un archivo JSON exportado desde esta app
              </p>

              {/* Estado de importación */}
              {isImporting && (
                <div className='mt-4'>
                  <div className='h-1.5 bg-gray-700 rounded-full overflow-hidden'>
                    <div className='h-full bg-gradient-to-r from-emerald-500 to-green-400 animate-pulse'></div>
                  </div>
                  <p className='text-xs text-emerald-400 mt-2 text-center'>
                    Procesando JSON desde Java...
                  </p>
                </div>
              )}
            </div>

            {/* Contenido principal */}
            <div className='p-6'>
              <div className='space-y-6'>
                {/* Botón principal */}
                <Button
                  className='w-full h-14 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold text-lg rounded-xl shadow-lg hover:from-emerald-700 hover:to-green-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
                  onPress={handleOpenFileSelector}
                  isDisabled={isImporting}
                  startContent={
                    isImporting ? (
                      <div className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full'></div>
                    ) : (
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
                          d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
                        />
                      </svg>
                    )
                  }
                >
                  {isImporting ? 'Procesando...' : 'Seleccionar archivo JSON'}
                </Button>

                {/* Panel de información */}
                <div className='bg-gray-800/50 rounded-xl p-4 border border-gray-700/50'>
                  <div className='flex items-start gap-3'>
                    <div className='mt-1'>
                      <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse'></div>
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-gray-300 font-medium mb-2'>
                        Proceso de importación
                      </h3>
                      <ul className='text-gray-400 text-sm space-y-1.5'>
                        <li className='flex items-center gap-2'>
                          <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></div>
                          <span>Java valida el JSON con JsonNormalizer</span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></div>
                          <span>Se valida estructura con ExportJsonData</span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></div>
                          <span>Confirmación antes de reemplazar</span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></div>
                          <span>Conversión automática a InventoryType</span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></div>
                          <span className='text-amber-300'>
                            ✓ Decimales permitidos en cantidades
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Vista previa del JSON (solo si hay datos) */}
                  {jsonPreview && (
                    <div className='mt-4 pt-4 border-t border-gray-700/30'>
                      <div className='text-xs text-gray-400 mb-2'>
                        Vista previa del JSON:
                      </div>
                      <div className='bg-gray-900/80 rounded-lg p-3 border border-gray-700 max-h-32 overflow-y-auto'>
                        <pre className='text-xs text-emerald-300 font-mono whitespace-pre-wrap'>
                          {jsonPreview}
                          {jsonPreview.length > 500 ? '...' : ''}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón cancelar */}
                <Button
                  onPress={() => navigate(-1)}
                  className='w-full h-12 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors duration-300 rounded-xl font-medium border border-gray-700/50'
                  variant='flat'
                  isDisabled={isImporting}
                  startContent={
                    <svg
                      className='w-5 h-5'
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
                  }
                >
                  Volver atrás
                </Button>
              </div>
            </div>

            {/* Footer con información del estado */}
            <div className='px-6 pb-6'>
              <div className='text-xs text-gray-500 text-center'>
                {importMutation.isError ? (
                  <div className='text-red-400 bg-red-400/10 p-2 rounded-lg border border-red-400/20'>
                    ❌ Error al guardar en base de datos
                  </div>
                ) : importMutation.isSuccess ? (
                  <div className='text-emerald-400 bg-emerald-400/10 p-2 rounded-lg border border-emerald-400/20'>
                    ✅ Importación completada exitosamente
                  </div>
                ) : (
                  <div className='bg-gray-800/50 p-2 rounded-lg border border-gray-700/50'>
                    <div className='flex items-center justify-center gap-2'>
                      <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                      <span>Listo para importar desde Java</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer de la página */}
          <div className='mt-4 text-center'>
            <p className='text-xs text-gray-600'>
              JSON validado con JsonNormalizer • Compatibilidad total con
              ExportInventory
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmImport}
        title={modalData.title}
        message={modalData.message}
        seller={modalData.seller}
        productCount={modalData.productCount}
      />

      {/* Modal de Error */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={modalData.title}
        message={modalData.message}
        errorDetails={modalData.errorDetails}
      />
    </>
  );
};

export default ImportInventory;
