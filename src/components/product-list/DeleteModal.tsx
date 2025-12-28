import React from 'react';
import { Button } from '@heroui/button';
import { ProductType } from '../../models/models';
import DeleteProduct from './DeleteProduct';

const DeleteModal = ({
  setIsModal,
  product,
}: {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  product: ProductType;
}) => {
  const modalActions = () => {
    setIsModal((st) => !st);
  };
  return (
    <div className='min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover'>
      <div className='absolute bg-black opacity-80 inset-0 z-0'></div>
      <div className='w-full max-w-xs p-5 relative mx-auto my-auto rounded-md shadow-lg bg-white'>
        <div className=''>
          <section className='text-center flex justify-center'>
            <DeleteProduct product={product} />
          </section>
          <div className='flex justify-center'>
            <Button onPress={modalActions} className='w-full'>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
