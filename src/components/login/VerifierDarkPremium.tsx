import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@heroui/button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  CheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  DocumentMagnifyingGlassIcon,
  ShareIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import { useUserStore } from '../../store/userStore';
import { USER_ACTION_TYPES } from '../../store/userActions';

// ----------------- Tipos -----------------
interface ProcessLog {
  timestamp: Date;
  type: 'info' | 'success' | 'error' | 'warning' | 'step';
  message: string;
  details?: string;
}

interface DeviceData {
  androidId: string;
  publicKey: string;
  timestamp: string;
}

interface LicenseData {
  deviceId: string;
  expiry: string;
  features: string[];
  issuedAt: string;
}

// ----------------- Componente Principal -----------------
const LicenseVerifier: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [processLogs, setProcessLogs] = useState<ProcessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingLicense, setIsCheckingLicense] = useState(false);
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  //@ts-expect-error
  const [isInterfaceReady, setIsInterfaceReady] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // ✅ Zustand Store
  const dispatch = useUserStore((state) => state.dispatch);

  // ----------------- Utilidades de Logging UX -----------------
  const addLog = (
    type: ProcessLog['type'],
    message: string,
    details?: string,
  ) => {
    const log: ProcessLog = {
      timestamp: new Date(),
      type,
      message,
      details,
    };

    setProcessLogs((prev) => [...prev, log]);

    setTimeout(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // ✅ Función para activar la aplicación
  //@ts-expect-error
  const activateApplication = (license: LicenseData) => {
    addLog('success', 'Activando aplicación...');

    try {
      dispatch({
        type: USER_ACTION_TYPES.VERIFY,
        payload: {
          isAuth: false,
          isVerified: true,
          username: undefined,
          password: undefined,
        },
      });

      addLog('success', '¡Aplicación activada!');
      toast.success(`Licencia activada exitosamente`);

      // Redirigir al dashboard principal
      setTimeout(() => {
        window.location.href = '/app';
      }, 1500);
    } catch (error) {
      addLog(
        'error',
        'Error activando aplicación',
        'Por favor, contacta al soporte técnico',
      );
      toast.error('Error al activar la aplicación');
    }
  };

  // ----------------- Inicialización Segura -----------------
  useEffect(() => {
    let initializationAttempts = 0;
    const maxAttempts = 15;

    const initializeCallbacks = () => {
      if (window.AndroidInterface) {
        try {
          // Callback cuando se encuentra una licencia
          if (!window.AndroidInterface.onLicenseFound) {
            window.AndroidInterface.onLicenseFound = (licenseData: string) => {
              addLog('success', 'Licencia encontrada');
              addLog('info', 'Verificando licencia...');

              setTimeout(() => {
                if (window.AndroidInterface?.decryptLicenseFromWebView) {
                  try {
                    const result =
                      window.AndroidInterface.decryptLicenseFromWebView(
                        licenseData,
                      );

                    if (result.startsWith('ERROR')) {
                      addLog('error', 'Error en verificación', result);
                      setIsCheckingLicense(false);
                      toast.error('La licencia no es válida');
                    }
                  } catch (error) {
                    addLog(
                      'error',
                      'Error procesando licencia',
                      'Intenta nuevamente',
                    );
                    setIsCheckingLicense(false);
                  }
                }
              }, 500);
            };
          }

          // Callback para errores
          if (!window.AndroidInterface.onLicenseSearchError) {
            window.AndroidInterface.onLicenseSearchError = (error: string) => {
              addLog('error', 'Error al procesar la licencia', error);
              setIsCheckingLicense(false);
              toast.error('No se pudo procesar la licencia');
            };
          }

          // Callback cuando la licencia es verificada
          if (!window.AndroidInterface.onLicenseVerified) {
            window.AndroidInterface.onLicenseVerified = (
              verifiedLicense: string,
            ) => {
              try {
                addLog('success', 'Dispositivo verificado');

                const license: LicenseData = JSON.parse(verifiedLicense);
                setLicenseData(license);

                addLog('success', 'Licencia verificada exitosamente');
                addLog(
                  'info',
                  `Expiración: ${new Date(license.expiry).toLocaleDateString()}`,
                );

                setIsCheckingLicense(false);
                setCurrentStep(3);

                // ✅ ACTIVAR LA APLICACIÓN
                setTimeout(() => {
                  activateApplication(license);
                }, 1500);
              } catch (error) {
                addLog('error', 'Error procesando licencia');
                setIsCheckingLicense(false);
              }
            };
          }

          addLog('success', 'Sistema listo');
          return true;
        } catch (error) {
          addLog('error', 'Error de configuración');
          return false;
        }
      }
      return false;
    };

    const tryInitialize = () => {
      initializationAttempts++;

      if (initializationAttempts > maxAttempts) {
        addLog('warning', 'Inicializando con datos de prueba...');
        initializeWithFallbackData();
        return;
      }

      addLog(
        'info',
        `Inicializando sistema (${initializationAttempts}/${maxAttempts})`,
      );

      if (initializeCallbacks()) {
        setIsInterfaceReady(true);
        addLog('success', 'Interfaz lista');

        // Obtener datos del dispositivo
        setTimeout(() => {
          initializeDeviceData();
        }, 500);
      } else {
        setTimeout(tryInitialize, 1000);
      }
    };

    const initializeWithFallbackData = () => {
      const fallbackData: DeviceData = {
        androidId: 'Dispositivo de prueba',
        publicKey: 'Clave de prueba',
        timestamp: new Date().toISOString(),
      };
      setDeviceData(fallbackData);
      setIsLoading(false);
      setCurrentStep(2);
      addLog('warning', 'Usando modo de prueba');
    };

    const initializeDeviceData = () => {
      addLog('info', 'Obteniendo información del dispositivo...');

      try {
        if (!window.AndroidInterface) {
          throw new Error('Interfaz no disponible');
        }

        const androidId =
          window.AndroidInterface.getAndroidId?.() || 'No disponible';
        const publicKey =
          window.AndroidInterface.getPublicKeyBase64?.() || 'No disponible';

        const data: DeviceData = {
          androidId,
          publicKey,
          timestamp: new Date().toISOString(),
        };

        setDeviceData(data);
        addLog('success', 'Información obtenida');
        addLog('info', `ID del dispositivo: ${androidId}`);

        setIsLoading(false);
        setCurrentStep(2);
      } catch (error) {
        addLog('error', 'Error obteniendo datos');
        initializeWithFallbackData();
      }
    };

    // Iniciar el proceso
    if (document.readyState === 'complete') {
      tryInitialize();
    } else {
      window.addEventListener('load', tryInitialize);
    }

    return () => {
      window.removeEventListener('load', tryInitialize);
    };
  }, [dispatch]);

  // ----------------- Seleccionar Archivo de Licencia -----------------
  const handleSelectLicenseFile = () => {
    addLog('step', 'Seleccionando archivo de licencia');

    if (!window.AndroidInterface) {
      addLog('error', 'Interfaz no disponible');
      toast.error('Sistema no disponible');
      return;
    }

    if (typeof window.AndroidInterface.openLicenseFilePicker !== 'function') {
      addLog('error', 'Función no disponible');
      toast.error('Función no disponible en este dispositivo');
      return;
    }

    setIsCheckingLicense(true);
    addLog('info', 'Buscando licencia...');

    try {
      window.AndroidInterface.openLicenseFilePicker();
      addLog('success', 'Selector abierto');
      addLog('info', 'Busca el archivo license_*.zip');

      // Timeout informativo
      setTimeout(() => {
        if (isCheckingLicense) {
          addLog('info', 'Tómate tu tiempo para encontrar el archivo');
        }
      }, 3000);
    } catch (error) {
      addLog('error', 'Error al abrir selector');
      setIsCheckingLicense(false);
      toast.error('Error al abrir selector');
    }
  };

  // ✅ COMPARTIR ARCHIVO ZIP (Para usuario final)
  const handleShareZip = () => {
    addLog('step', 'Compartiendo archivo seguro');

    if (!window.AndroidInterface?.shareZipFile) {
      addLog('error', 'Función no disponible');
      toast.error('Función de compartir no disponible');
      return;
    }

    try {
      window.AndroidInterface.shareZipFile();
      addLog('success', 'Preparando para compartir...');
      addLog('info', 'Selecciona una aplicación para compartir');
      toast.success('Preparando archivo para compartir...');
    } catch (error) {
      addLog('error', 'Error al compartir');
      toast.error('Error al compartir archivo');
    }
  };

  // ----------------- Render -----------------
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 flex items-center justify-center'>
        <div className='text-center'>
          <motion.div
            className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4'
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <h2 className='text-xl font-semibold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'>
            Configurando sistema de seguridad...
          </h2>
          <p className='text-gray-400'>Un momento por favor</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6'>
      {/* Header */}
      <motion.div
        className='text-center mb-8'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2'>
          Activación de Licencia
        </h1>
        <p className='text-gray-400 text-sm sm:text-base'>
          Sigue estos sencillos pasos para activar tu aplicación
        </p>
      </motion.div>

      {/* Progreso de Pasos */}
      <div className='flex justify-center mb-8'>
        <div className='flex items-center space-x-2 sm:space-x-4'>
          {[1, 2, 3].map((step) => (
            <div key={step} className='flex items-center'>
              <motion.div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 border-transparent text-white shadow-lg'
                    : 'border-gray-600 text-gray-400'
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {currentStep > step ? (
                  <CheckIcon className='w-4 h-4 sm:w-5 sm:h-5' />
                ) : (
                  step
                )}
              </motion.div>
              {step < 3 && (
                <div
                  className={`w-8 sm:w-12 h-1 ${
                    currentStep > step
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500'
                      : 'bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='max-w-2xl mx-auto space-y-4 sm:space-y-6'>
        {/* Paso 1: Identificación del Dispositivo */}
        <motion.div
          className='bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-cyan-500/20 shadow-2xl'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-cyan-400 font-semibold flex items-center gap-2 text-sm sm:text-base'>
              <DevicePhoneMobileIcon className='w-4 h-4 sm:w-5 sm:h-5' />
              Paso 1: Identificación
            </h3>
            <div className='bg-gradient-to-r from-cyan-500 to-green-500 text-white text-xs px-2 py-1 rounded-full'>
              Completado
            </div>
          </div>

          <div className='space-y-3'>
            <div className='p-3 bg-gray-900/50 rounded-lg'>
              <span className='text-cyan-300 text-sm'>ID del Dispositivo:</span>
              <div className='mt-1'>
                <code className='text-cyan-200 font-mono text-xs sm:text-sm break-all'>
                  {deviceData?.androidId}
                </code>
              </div>
            </div>
          </div>

          <div className='mt-4 p-3 bg-cyan-900/20 border border-cyan-700 rounded-lg'>
            <p className='text-cyan-300 text-xs sm:text-sm'>
              ✅ Tu dispositivo ha sido identificado correctamente.
            </p>
          </div>
        </motion.div>

        {/* Paso 2: Verificación de Licencia */}
        {currentStep >= 2 && (
          <motion.div
            className='bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-purple-500/20 shadow-2xl'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-purple-400 font-semibold flex items-center gap-2 text-sm sm:text-base'>
                <DocumentMagnifyingGlassIcon className='w-4 h-4 sm:w-5 sm:h-5' />
                Paso 2: Activación
              </h3>
              <div
                className={`text-xs px-2 py-1 rounded-full ${
                  currentStep > 2
                    ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                }`}
              >
                {currentStep > 2 ? 'Completado' : 'En progreso'}
              </div>
            </div>

            <p className='text-purple-300 mb-4 text-sm sm:text-base'>
              Selecciona el archivo de licencia que recibiste para activar tu
              aplicación.
            </p>

            {/* Botón principal para seleccionar licencia */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onPress={handleSelectLicenseFile}
                className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 !text-white py-3 rounded-xl font-semibold shadow-lg'
                isLoading={isCheckingLicense}
                isDisabled={currentStep > 2 || isCheckingLicense}
              >
                {isCheckingLicense ? (
                  <div className='flex items-center gap-2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    Verificando licencia...
                  </div>
                ) : (
                  <div className='flex items-center justify-center gap-2'>
                    <CloudArrowUpIcon className='w-5 h-5' />
                    Seleccionar Archivo de Licencia
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Botón para compartir ZIP */}
            <motion.div
              className='mt-4'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onPress={handleShareZip}
                className='w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 !text-white py-3 rounded-xl font-semibold shadow-lg'
                isDisabled={isCheckingLicense}
              >
                <div className='flex items-center justify-center gap-2'>
                  <ShareIcon className='w-5 h-5' />
                  Compartir Archivo Seguro
                </div>
              </Button>
            </motion.div>

            {/* Información para el usuario */}
            <div className='mt-6 space-y-3'>
              <div className='p-3 bg-purple-900/20 border border-purple-700 rounded-lg'>
                <h4 className='text-purple-300 font-semibold mb-1 text-sm'>
                  📋 ¿Cómo obtener tu licencia?
                </h4>
                <ul className='text-purple-200 text-xs space-y-1'>
                  <li>1. Contacta al soporte técnico</li>
                  <li>2. Comparte tu ID de dispositivo</li>
                  <li>3. Recibirás un archivo .zip</li>
                  <li>4. Selecciona ese archivo aquí</li>
                </ul>
              </div>

              <div className='p-3 bg-blue-900/20 border border-blue-700 rounded-lg'>
                <h4 className='text-blue-300 font-semibold mb-1 text-sm'>
                  📤 ¿Para qué sirve "Compartir Archivo Seguro"?
                </h4>
                <p className='text-blue-200 text-xs'>
                  Comparte el archivo de configuración segura del dispositivo
                  con el soporte técnico cuando lo soliciten.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Paso 3: Activación Exitosa */}
        {currentStep >= 3 && (
          <motion.div
            className='bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-green-500/20 shadow-2xl'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-green-400 font-semibold flex items-center gap-2 text-sm sm:text-base'>
                <KeyIcon className='w-4 h-4 sm:w-5 sm:h-5' />
                Paso 3: ¡Activada!
              </h3>
              <div className='bg-gradient-to-r from-green-500 to-cyan-500 text-white text-xs px-2 py-1 rounded-full'>
                Completado
              </div>
            </div>

            <div className='text-center py-6'>
              <motion.div
                className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckIcon className='w-8 h-8 sm:w-10 sm:h-10 text-white' />
              </motion.div>

              <h4 className='text-green-300 text-xl font-bold mb-3'>
                ¡Activación Exitosa!
              </h4>

              <p className='text-green-400 mb-6 text-sm sm:text-base'>
                Redirigiendo a tu aplicación...
              </p>

              {licenseData && (
                <motion.div
                  className='bg-gray-900/50 rounded-xl p-5 mt-4 border border-green-700/30'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h5 className='text-green-300 font-semibold mb-3 text-base'>
                    Detalles de tu licencia:
                  </h5>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-300 text-sm'>Estado:</span>
                      <span className='bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-xs font-medium'>
                        ✅ Activa
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-300 text-sm'>Expiración:</span>
                      <span className='text-green-200 text-sm font-medium'>
                        {new Date(licenseData.expiry).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-300 text-sm'>Emitida:</span>
                      <span className='text-green-200 text-sm'>
                        {new Date(licenseData.issuedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Panel de Progreso (Simplificado para usuario) */}
        <motion.div
          className='bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-700 shadow-2xl'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-gray-300 font-semibold text-sm sm:text-base'>
              Progreso del Sistema
            </h3>
            <div className='text-gray-400 text-xs sm:text-sm'>
              {processLogs.length} eventos
            </div>
          </div>

          <div className='bg-gray-900/50 rounded-lg border border-gray-700 h-48 sm:h-64 overflow-y-auto p-3 sm:p-4'>
            {processLogs.length === 0 ? (
              <div className='text-gray-500 text-center py-8 text-sm'>
                El progreso aparecerá aquí...
              </div>
            ) : (
              <div className='space-y-2'>
                {processLogs.slice(-10).map(
                  (
                    log,
                    index, // Solo mostrar últimos 10 logs
                  ) => (
                    <div
                      key={index}
                      className={`p-2 sm:p-3 rounded text-xs sm:text-sm ${
                        log.type === 'error'
                          ? 'bg-red-900/20 text-red-300 border border-red-800'
                          : log.type === 'success'
                            ? 'bg-green-900/20 text-green-300 border border-green-800'
                            : log.type === 'warning'
                              ? 'bg-yellow-900/20 text-yellow-300 border border-yellow-800'
                              : 'bg-gray-900/20 text-gray-300'
                      }`}
                    >
                      <div className='flex justify-between items-start'>
                        <span>{log.message}</span>
                        <span className='text-gray-400 text-xs ml-2 whitespace-nowrap'>
                          {log.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ),
                )}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer informativo */}
      <motion.div
        className='mt-8 text-center text-gray-500 text-xs'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Si necesitas ayuda, contacta al soporte técnico.</p>
        <p className='mt-1'>Proceso seguro y cifrado</p>
      </motion.div>
    </div>
  );
};

export default LicenseVerifier;
