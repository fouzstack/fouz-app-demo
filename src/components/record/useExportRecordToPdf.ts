// hooks/useExportToPdf.ts

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getRecord } from '../../models/records';

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

// Nueva función que obtiene un registro y lo envía a Android
async function fetchRecordAndSend(position: number) {
  const record = await getRecord(position);

  if (!record) throw new Error('Registro no encontrado');

  const jsonString = JSON.stringify(record);
  await sendJsonToAndroid(jsonString);
}

// Custom hook para exportar el registro seleccionado
export function useExportRecordToPdf() {
  const [isExporting, setIsExporting] = useState(false);

  const mutation = useMutation({
    mutationFn: fetchRecordAndSend,
    onMutate: () => {
      setIsExporting(true);
    },
    onSuccess: () => {
      toast.success('Registro JSON enviado a Android para crear PDF.', {
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

  const handleSendJson = (position: number) => {
    if (!mutation.isPending) {
      mutation.mutate(position);
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
