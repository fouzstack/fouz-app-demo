import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import inventory from '../models/inventorydb';
//import inventory from '../models/inventorydb';

// Función que envía JSON a Android con reintentos
async function sendJsonToAndroid(
  jsonString: string,
  maxRetries = 5,
  retryDelayMs = 500,
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    if (window.AndroidInterface?.jsonToPdf) {
      window.AndroidInterface.jsonToPdf(jsonString);
      return;
    }
    toast(
      `Intento ${attempt} - Interfaz Android no disponible, reintentando...`,
      { duration: 1000 },
    );
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
  }
  throw new Error('Interfaz Android no disponible después de varios intentos.');
}

// Función que se usará como mutationFn
async function fetchInventoryAndSend() {
  //const inventoryModule = await import('../models/inventorydb');
  //const _inventory = inventory.getInventory;
  //const inventoryData = await inventoryModule.default.getInventory();
  const inventoryData = await inventory.getInventory();
  const jsonString = JSON.stringify(inventoryData);
  await sendJsonToAndroid(jsonString);
}

// Custom hook con React Query usando mutationFn
export function useExportToPdf() {
  const [isExporting, setIsExporting] = useState(false);

  const mutation = useMutation({
    mutationFn: fetchInventoryAndSend,
    onMutate: () => {
      setIsExporting(true);
    },
    onSuccess: () => {
      toast.success('JSON enviado a Android para crear PDF.', {
        duration: 3000,
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      alert(`Error enviando JSON: ${message}`);
    },
    onSettled: () => {
      setIsExporting(false);
    },
  });

  const handleSendJson = () => {
    if (!mutation.isPending) {
      // isPending para controlar estado cargando
      mutation.mutate();
    }
  };

  return {
    handleSendJson,
    isExporting,
    error: mutation.error,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
}
