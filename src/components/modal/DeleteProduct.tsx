import React from 'react';
import { Button } from '@heroui/button';
//import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useDeleteMutation } from '../../hooks/useDeleteMutation.tsx';
import { product as productdb } from '../../models/product.ts';
import { ProductType } from '../../models/models.ts';

const DeleteProduct = ({ product }: { product: ProductType }) => {
  const { mutation } = useDeleteMutation(product.id, productdb.delete);

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
    <section className='flex flex-col'>
      <Toaster />

      <Button
        radius='sm'
        className='mb-4 bg-purple-950 text-white font-light'
        onPress={handlePressedButton}
      >
        Eliminar Todos los Productos
      </Button>
    </section>
  );
};

export default DeleteProduct;
