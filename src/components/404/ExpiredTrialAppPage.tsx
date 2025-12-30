import { Button } from '@heroui/button';

import { useNavigate } from 'react-router-dom';

export default function ExpiredTrialAppPage() {
  const navigate = useNavigate();
  return (
    <div className='w-full text-center py-12 min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800'>
      <h1 className='text-white font-extrabold text-3xl'>
        Oops! Expired trial Time!
      </h1>
      <p className='text-xs text-white'>
        Debe dar entrada a los productos de su Inventario!
      </p>
      <Button
        onPress={() => navigate('/')}
        variant='ghost'
        className='border-none mt-4 font-extrabold text-emerald-400 hover:text-black'
      >
        Regresar
      </Button>
    </div>
  );
}
