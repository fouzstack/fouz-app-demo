import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';
import SetProductIntoInventory from '../inventory-setter/SetProductIntoInventory';
import { useDeleteMutation } from '../../hooks/useDeleteMutation';
import { productdb } from '../../models/product.database';
import RedTrashIcon from '../icons/RedTrashIcon';
import { useProductStore } from '../../store/store';

const SetProductIntoInventoryModal = () => {
  const product = useProductStore((state) => state.product);

  // Mutaciones para actualizar y borrar producto
  const { mutation: deleteMutation } = useDeleteMutation(
    product?.id,
    productdb.delete,
  );
  const navigate = useNavigate();
  // Maneja la eliminación del producto
  const deleteHandleClick = async () => {
    await deleteMutation.mutateAsync();
    navigate('/');
    //window.location.reload();
  };

  return (
    <div className='w-full h-screen flex justify-center  outline-none focus:outline-none bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900'>
      <div className='px-5 py-2 bg-gray-900 relative mx-auto my-auto rounded-xl shadow-lg'>
        <div className='relative bg-gray-900 '>
          <div
            onClick={deleteHandleClick}
            className='z-50 w-full flex justify-end cursor-pointer p-2 py-4'
          >
            <RedTrashIcon size={30} />
          </div>
          <div className=''>
            <SetProductIntoInventory product={product} />
          </div>
          <div className='w-full px-2 py-3'>
            <Button
              onPress={() => navigate('/')}
              variant='ghost'
              className='w-full text-white'
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <div className='py-4'></div>
    </div>
  );
};

export default SetProductIntoInventoryModal;
