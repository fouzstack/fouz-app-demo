import React, { ReactNode } from 'react';
//import { Button } from '@heroui/button';
//import { useNavigate } from 'react-router-dom';
import ProductInfo from './ProductInfo';
import { ToggleInfoContext, ToggleInfoContextType } from './ToggleInfoContext';

interface ModalProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  //const navigate = useNavigate();
  const [showChildren, setShowChildren] = React.useState(true);

  const toggleInfo: ToggleInfoContextType = () => {
    setShowChildren((prev) => !prev);
  };

  return (
    <ToggleInfoContext.Provider value={toggleInfo}>
      <div className='min-w-screen h-full min-h-screen overflow-y-auto  bg-black flex justify-center items-center outline-none focus:outline-none'>
        <div className='bg-black opacity-80'></div>
        <div className='w-full max-w-xs relative mx-auto rounded-md shadow-lg bg-black'>
          <div className='px-4'>
            <section className='text-center bg-black'>
              {showChildren ? children : <ProductInfo />}
            </section>
          </div>
        </div>
      </div>
    </ToggleInfoContext.Provider>
  );
};

export default Modal;
