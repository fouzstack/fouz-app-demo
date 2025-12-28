import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { GlobalProduct } from '../../store/actions';

interface CustomerMoneyReceivedProps {
  product: GlobalProduct;
}

const CustomerMoneyReceived = ({ product }: CustomerMoneyReceivedProps) => {
  const [moneyReceived, setMoneyReceived] = useState('');
  const navigate = useNavigate();

  const totalPrice = product.price * (product.quantity || 0);
  const change = moneyReceived ? Number(moneyReceived) - totalPrice : 0;
  return (
    <section>
      <article className='text-3xl my-8'>
        <h2>Precio: ${product.price}</h2>
        <h2>Cantidad: {product.quantity}</h2>
        <h2>Importe: ${totalPrice}</h2>
      </article>
      <Input
        type='number'
        value={moneyReceived}
        onChange={(e) => setMoneyReceived(e.target.value)}
        placeholder='Recibido por el cliente'
        className='rounded-md  border-none p-2 mt-2 mb-4 w-full text-white'
        classNames={{
          label: '!font-extrabold text-xl text-emerald-500',
          input:
            '!font-bold !text-black placeholder:text-red-500 placeholder:font-extrabold tracking-widest',
        }}
      />
      {change < 0 ? (
        <h2>Falta</h2>
      ) : change > 0 ? (
        <h2>Cambio</h2>
      ) : (
        <h2>Cambio:</h2>
      )}

      <div className='flex flex-col items-center justify-center'>
        <p
          className={`text-center text-6xl mt-1 ${change < 0 ? 'text-red-500' : 'text-[#a8b0d3]'}`}
        >
          {change < 0
            ? `$${Math.abs(change).toFixed(2)}`
            : change > 0
              ? `$${change.toFixed(2)}`
              : '0.00'}
        </p>
        <Button
          variant='ghost'
          onPress={() => {
            navigate(-1);
          }}
          radius='sm'
          className='border-emerald-500 text-xl text-emerald-500 mt-[2em]'
          color='primary'
        >
          Regresar
        </Button>
      </div>
    </section>
  );
};

export default CustomerMoneyReceived;
