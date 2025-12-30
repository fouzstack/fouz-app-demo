import { Button } from '@heroui/button';
import { useServerActionsMutation } from '../../hooks/useServerActionsMutation';
import { recordsdb } from '../../models/records.database';
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export const RecordsDelete = () => {
  const { mutation } = useServerActionsMutation(recordsdb.deleteAll, [
    'delete-records',
  ]);
  const handleResetRecordsButton = async () => {
    await mutation.mutateAsync();
  };
  React.useEffect(() => {
    if (mutation.isSuccess) {
      const message = mutation.data
        ? mutation.data
        : 'El producto se ha actualizado, pero no existe información adicional.';
      toast.success(message);
    } else if (mutation.isError) {
      toast.error('Error al actualizar el producto: ' + String(mutation.error));
    }
  }, [mutation.isSuccess, mutation.isError, mutation.data, mutation.error]);
  return (
    <>
      <Toaster />
      <Button
        className=' bg-transparent text-white'
        onPress={handleResetRecordsButton}
      >
        <span className='w-full text-amber-400 text-left'>
          Eliminar Registros
        </span>
      </Button>
    </>
  );
};
