//@ts-nochec
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';

import {
  IncomingUpdateFormData,
  IncomingUpdateSchema,
} from './incoming.schema';
import { useProductStore } from '../../store/store';

export function useIncomingUpdate() {
  const product = useProductStore((state) => state.product);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IncomingUpdateFormData>({
    resolver: zodResolver(IncomingUpdateSchema),
    defaultValues: {
      incoming_products: 0, // IMPORTANTE: inicializamos como 0 para que el usuario ingrese incremento
    },
  });

  const [finalProducts, setFinalProducts] = useState<number>(
    (product?.final_products ??
      (product?.initial_products || 0) +
        (product?.incoming_products || 0) -
        (product?.losses || 0)) ||
      0,
  );

  // Observar solo losses y nuevo incremento en incoming_products (que es incremento)
  const incomingIncrement = watch('incoming_products', 0);
  const losses = product?.losses || 0;
  //console.log(incomingIncrement)
  useEffect(() => {
    const initial = product?.initial_products || 0;
    const incomingStored = product?.incoming_products || 0;
    const lossesStored = product?.losses || 0;
    const finalStored =
      product?.final_products ?? initial + incomingStored - lossesStored;

    // Calculamos sold con base en valores almacenados y constantes
    const sold = initial + incomingStored - lossesStored - finalStored;

    // NUEVO cálculo: incoming actual es acumulado + incremento del formulario (que puede ser cero)
    const newIncomingTotal = incomingStored + Number(incomingIncrement);

    // Nuevo stock disponible actualizado = initial + incoming acumulado - pérdidas
    const newAvailable = initial + newIncomingTotal - losses;

    // Nuevo final respetando la integridad de sold
    const newFinal = newAvailable - sold;
    setFinalProducts(newFinal);
  }, [incomingIncrement, losses, product, setError, clearErrors, setValue]);

  return {
    watch,
    register,
    handleSubmit,
    errors,
    setValue,
    setError,
    finalProducts,
    product,
  };
}
