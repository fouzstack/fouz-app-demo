import React from 'react';
import { Button } from '@heroui/button';
//import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDeleteMutation } from '../../hooks/useDeleteMutation.tsx';
import { product as productDb } from '../../models/product.ts';
import { ProductType } from '../../models/models.ts';

const DeleteProduct = ({ product }: { product: ProductType }) => {
  const { mutation } = useDeleteMutation(product.id, productDb.delete);

  //const navigate = useNavigate();

  const handlePressedButton = async () => {
    await mutation.mutateAsync();
    window.location.reload();
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
    <div className='w-full flex flex-col gap-4'>
      <h2>Seguro de Eliminar Producto?</h2>
      <Button
        radius='sm'
        color='danger'
        className='my-2'
        onPress={handlePressedButton}
      >
        Eliminar {product.name}
      </Button>
    </div>
  );
};

export default DeleteProduct;
