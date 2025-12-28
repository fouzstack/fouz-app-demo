import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ProductType } from '../../models/models';
import { createOrUpdateInventory } from '../../models/createOrUpdateInventory';
import { usePartialMutation } from '../../models/usePartialMutation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import NumericKeyboard from '../numericKeyboard/NumericKeyboard';

// Zod Schema para la validación
const schema = z.object({
  initial_products: z.number().min(1, 'Se necesita al menos 1 producto'),
});

const SetProductIntoInventory = ({
  product,
}: {
  product: Partial<ProductType>;
}) => {
  const navigate = useNavigate();
  const { mutation } = usePartialMutation(createOrUpdateInventory);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Manejar currentValue como una cadena
  const [currentValue, setCurrentValue] = useState('');
  const onSubmit = async () => {
    if (
      product?.incoming_products == undefined ||
      product?.initial_products == undefined
    ) {
      toast.error('valores indefinidos son invalidos!');
      return;
    }
    if (product?.incoming_products + product?.initial_products > 0) {
      toast.error(`${product.name} ya está en inventario!`);
      return;
    }

    try {
      await mutation.mutateAsync({
        id: product.id,
        code: product.code,
        name: product.name,
        unit: product.unit,
        cost: product.cost,
        price: product.price,
        initial_products: parseFloat(currentValue), // Convertir a número
        incoming_products: product.incoming_products,
        losses: product.losses,
        final_products: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
      toast.success('Guardado en Inventario!');
      navigate('/finales');
    } catch (error) {
      toast.error('Error al guardar: ' + String(error));
    }
  };

  const handleKeyPress = (
    key: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (key === 'del') {
      setCurrentValue((prev) => prev.slice(0, -1)); // Borrar el último carácter
      setValue('initial_products', parseFloat(currentValue.slice(0, -1)) || 0); // Actualizar el formulario
    } else {
      const newValue = currentValue + key;

      // Validar que no haya múltiples puntos decimales
      if (key !== '.' || !currentValue.includes('.')) {
        setCurrentValue(newValue);
        setValue('initial_products', parseFloat(newValue) || 0); // Actualiza el formulario
      }
    }
  };

  return (
    <div className='w-full rounded-xl gap-2 flex flex-col p-2 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pb-4'>
      <Button
        variant='ghost'
        className='w-full text-md text-gray-100 font-bold border border-gray-700 bg-gray-800/50  hover:bg-gray-700/60 transition-all duration-200 '
      >
        {product.name}
      </Button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full min-w-[320px] max-w-[450px] flex flex-col'
      >
        <Input
          type='text'
          label='Cantidad de Productos'
          color='primary'
          variant='underlined'
          className='my-4'
          {...register('initial_products', {
            setValueAs: (v) => (v ? Number(v) : 0),
          })}
          classNames={{
            label: '!text-xs !text-gray-300 font-black tracking-widest',
            input: '!text-gray-100 font-extrabold tracking-widest',
            description: 'text-gray-400',
            errorMessage: 'text-red-400',
            helperWrapper: 'text-gray-400',
            inputWrapper: [
              'bg-gray-800/50',
              'backdrop-blur-sm',
              'border-gray-700',
              'hover:bg-gray-700/40',
              'group-data-[focus=true]:bg-gray-800',
              'group-data-[focus=true]:border-primary-400',
              'transition-all duration-200',
            ],
          }}
          value={currentValue}
          readOnly // Permitir solo el teclado numérico
        />
        {errors.initial_products && (
          <p className='text-xs text-left text-red-400 font-medium'>
            {String(errors.initial_products.message)}
          </p>
        )}
        <NumericKeyboard onKeyPress={handleKeyPress} />
        <div className='w-full flex justify-center'>
          <Button
            color='primary'
            type='submit'
            className='w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-50 '
          >
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SetProductIntoInventory;
