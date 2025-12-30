import React from 'react';
import { Button } from '@heroui/button';

//import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import jsonData from '../../products.json';
import { useBulkCreateProducts } from '../../hooks/useBulkCreateProducts.tsx';

const CreateProductList = () => {
  //@ts-expect-error
  const { mutation } = useBulkCreateProducts(jsonData, product.addMany, [
    'bulk-create-products',
  ]);

  //const navigate = useNavigate();

  const handleNewInventoryButton = async () => {
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
    <section className='flex flex-col '>
      <Toaster />
      <Button
        radius='sm'
        className='mb-4 bg-emerald-800 text-white font-light'
        onPress={handleNewInventoryButton}
      >
        Crea tu lista de Productos
      </Button>
    </section>
  );
};

export default CreateProductList;
