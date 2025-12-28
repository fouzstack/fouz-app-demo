import React from 'react';
import { Button } from '@heroui/button';
import toast from 'react-hot-toast';
import { useServerActionsMutation } from '../../hooks/useServerActionsMutation.tsx';
import inventory from '../../models/inventorydb.ts';

export const DeleteInventories = () => {
  const { mutation } = useServerActionsMutation(inventory.deleteAll, [
    'deleteAll-products',
  ]);

  //const navigate = useNavigate();

  const handlePressedButton = async () => {
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
    <>
      <Button
        className='text-white  bg-transparent'
        onPress={handlePressedButton}
      >
        <span className='w-full text-amber-400 text-left'>
          Eliminar Inventario
        </span>
      </Button>
    </>
  );
};
