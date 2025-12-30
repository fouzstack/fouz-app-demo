//@ts-nochec
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
//import inventory from '../../models/inventorydb';
//import inventory from '../../models/inventorydb';
//import { ProductType } from '../../models/models';

const ExportToPdf: React.FC = () => {
  const [isExporting, setIsExporting] = React.useState(false);

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSendJson = async () => {
    try {
      setIsExporting(true);
      // Supongamos que inventory.getInventory() está disponible globalmente
      const inventoryData = await import('../../models/inventorydb').then(
        (mod) => mod.default.getInventory(),
      );
      //const _inventory = inventory.getInventory();
      const jsonString = JSON.stringify(inventoryData);

      const maxRetries = 5;
      const retryDelayMs = 500;

      let found = false;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        if (window.AndroidInterface?.jsonToPdf) {
          window.AndroidInterface.jsonToPdf(jsonString);
          toast.success('JSON enviado a Android para crear PDF.', {
            duration: 3000,
          });
          found = true;
          break;
        } else {
          toast(
            `Intento ${attempt} - Interfaz Android no disponible, reintentando...`,
            { duration: 1000 },
          );
          await wait(retryDelayMs);
        }
      }

      if (!found) {
        alert(
          'Interfaz Android no disponible para JSInterface después de varios intentos.',
        );
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(`Error enviando JSON: ${message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className='p-4 max-w-md mx-auto bg-white rounded shadow-md'>
      <Toaster />
      <h2 className='text-xl font-semibold mb-4'>Exportar inventario a PDF</h2>
      <button
        onClick={handleSendJson}
        disabled={isExporting}
        className='mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:bg-gray-400'
      >
        {isExporting ? 'Procesando...' : 'Exportar'}
      </button>
    </div>
  );
};

export default ExportToPdf;
