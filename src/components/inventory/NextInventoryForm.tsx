import React from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setupNextInventory } from '../../models/setupNextInventory';
import { useCreateNextInventory } from '../../hooks/useCreateNextInventory';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
//import { useCounterStore } from '../../store/counterStore';

const inventorySchema = z.object({
  seller: z.string().min(1, 'El nombre es obligatorio'),
});

type CreateNextInventoryFormData = z.infer<typeof inventorySchema>;

const NextInventoryForm = () => {
  //const increase = useCounterStore((state) => state.increase);
  //const count = useCounterStore((state) => state.count);

  const navigate = useNavigate();
  const { mutation } = useCreateNextInventory(setupNextInventory, [
    'create-next-inventory',
  ]);
  //const { date } = useInventoryDate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateNextInventoryFormData>({
    resolver: zodResolver(inventorySchema),
  });

  const onSubmit = async (data: CreateNextInventoryFormData) => {
    await mutation.mutateAsync(data.seller);
  };

  React.useEffect(() => {
    if (mutation.isSuccess) {
      const message = mutation.data
        ? mutation.data
        : 'El producto se ha actualizado, pero no existe información adicional.';
      toast.success(message);
    } else if (mutation.isError) {
      toast.error('Error al actualizar el producto: ' + String(mutation.error));
    }
  }, [mutation.isSuccess, mutation.isError, mutation.data, mutation.error]);

  return (
    <div className='max-w-[320px] min-h-[300px] mt-4 rounded rounded-xl border border-black p-4 flex flex-col'>
      <h2 className='text-xl text-center text-gray-300 font-black '>
        {' '}
        Iniciar Inventario
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='max-w-[320px] min-h-[300px] p-4 flex flex-col'
      >
        <Input
          label='Su Nombre'
          color='primary'
          variant='underlined'
          className='mt-4'
          {...register('seller', {
            onChange: (e) => {
              setValue('seller', e.target.value);
            }, // Actualiza el valor en el formulario
          })}
          classNames={{
            label: '!text-md !text-gray-100',
            input: '!text-gray-100 tracking-widest',
          }}
        />
        {errors.seller && (
          <p className='text-red-500'>{String(errors.seller?.message)}</p>
        )}
        <div className='py-6'></div>
        <Button
          //isDisabled={ count > 100 ? true : false}
          color='primary'
          className='mb-6'
          //onPress={increase}
          type='submit' // Solo este botón puede enviar el formulario
          // Desactivado si hay errores
        >
          Iniciar Inventario
        </Button>
        <Button onPress={() => navigate('/finales')} className='w-full '>
          Cancel
        </Button>
        {mutation.isSuccess ? (
          <Button
            color='danger'
            className='my-2'
            onPress={() => navigate('/registros')}
          >
            Ver Registros
          </Button>
        ) : null}
      </form>
    </div>
  );
};
export default NextInventoryForm;
