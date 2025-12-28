import FinalProductsInput from './FinalProductsInput';
//import { useProductStore } from '../../store/store';

export default function UpdateTableContainer() {
  //const product = useProductStore((state) => state.product);
  return (
    <div className='min-w-screen h-full min-h-screen overflow-y-auto  bg-black flex justify-center items-center outline-none focus:outline-none'>
      <FinalProductsInput />
    </div>
  );
}
