import React from 'react';
import { Button } from '@heroui/button';
//import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useServerActionsMutation } from '../../hooks/useServerActionsMutation.tsx';
import { product } from '../../models/product.ts';

export const DeleteProducts = () => {
  const { mutation } = useServerActionsMutation(product.deleteAll, [
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
        className='text-white bg-transparent'
        onPress={handlePressedButton}
      >
        <span className='w-full text-amber-400 text-left'>
          Eliminar Productos
        </span>
      </Button>
    </>
  );
};
