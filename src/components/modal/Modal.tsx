import React, { useState } from 'react';
import { Button } from '@heroui/button';
//import { useNavigate } from 'react-router-dom';

const Modal = ({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string | Date;
}) => {
  //const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className=''>
      {/* Botón para abrir el modal */}
      <button
        onClick={() => {
          openModal();
        }}
        className='pointer animate-pulse py-2 hover:font-extrabold hover:text-gray-900'
      >
        {String(text)}
      </button>

      {/* Condicional para renderizar el modal solo si isOpen es true */}
      {isOpen && (
        <div className='min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover'>
          <div className='absolute bg-black opacity-80 inset-0 z-0'></div>
          <div className='w-full max-w-xs relative mx-auto my-auto rounded-md shadow-lg bg-white'>
            <div className='p-2 py-4 pb-8'>
              <section className='text-center'>{children}</section>
              <div className='flex justify-center'>
                <Button onPress={closeModal} className='w-full '>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;

/* const modalActions = () => {
    closeModal();
    navigate(-1);
  };
 */
