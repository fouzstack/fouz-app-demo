import React from 'react';
import { Button } from '@heroui/button';

//import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useServerActionsMutation } from '../../hooks/useServerActionsMutation.tsx';
import { recordsdb } from '../../models/records.database.ts';

const DeleteInventories = () => {
  const { mutation } = useServerActionsMutation(recordsdb.deleteAll, [
    'create-inventory',
  ]);

  //const navigate = useNavigate();

  const handleButtonClick = async () => {
    await mutation.mutateAsync();
  };

  React.useEffect(() => {
    if (mutation.isSuccess) {
      const message = mutation.data
        ? mutation.data
        : 'El producto se ha actualizado, pero no se devolvió información adicional.';
      toast.success(message);
    } else if (mutation.isError) {
      toast.error('Error al actualizar el producto: ' + String(mutation.error));
    }
  }, [mutation.isSuccess, mutation.isError, mutation.data, mutation.error]);

  return (
    <section className='flex flex-col'>
      <Toaster />
      <Button
        radius='sm'
        className='mb-4 bg-purple-950 text-white font-extrabold'
        onPress={handleButtonClick}
      >
        Eliminar Todos los Inventarios
      </Button>
    </section>
  );
};

export default DeleteInventories;
