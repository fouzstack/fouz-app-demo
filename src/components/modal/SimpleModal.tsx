import React from 'react';
import { Button } from '@heroui/button';

//import { useNavigate } from 'react-router-dom'; // Importa useNavigate

interface SimpleModalInterface {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const SimpleModal = ({ children, setIsModal }: SimpleModalInterface) => {
  //const navigate = useNavigate();
  return (
    <div className='w-full h-full min-h-screen overflow-y-auto py-8 bg-black opacity-80  outline-none focus:outline-none'>
      <div className='bg-black  opacity-80'></div>
      <div className='w-full max-w-xs  relative mx-auto rounded-md shadow-lg bg-white'>
        <div className=' px-4'>
          <section className='text-center'>{children}</section>
          <div className='pb-10'>
            <Button onPress={() => setIsModal(false)} className='w-full '>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleModal;
