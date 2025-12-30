import { Button } from '@heroui/button';
import { useNavigate } from 'react-router-dom';
//import EmptyBoxIcon from '../icons/EmptyBox';

export default function NotFoundProducts() {
  const navigate = useNavigate();
  return (
    <div className='w-full text-center py-12 min-h-screen text-gray-700'>
      <h1 className='font-extrabold text-xl'>
        Sin Inventario o Registros que Mostrar!
      </h1>
      <p className=''>Debe crear su Inventario o Registros!</p>
      <div className='flex justify-center p-4 py-20'>
        <svg
          className='animate-spin -ml-1 mr-3 h-12 w-12 text-blue-600'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          aria-label='Loading'
          role='img'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          ></circle>
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
          ></path>
        </svg>
      </div>
      <Button
        color='primary'
        onPress={() => navigate('/')}
        className='w-[200px] font-bold tracking-widest'
      >
        Inicio
      </Button>
    </div>
  );
}
