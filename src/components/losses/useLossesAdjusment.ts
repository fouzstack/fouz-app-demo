import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { LossesUpdateFormData, LossesUpdateSchema } from './losses.schema';
import { useProductStore } from '../../store/store';

export function useLossesAjustment() {
  const product = useProductStore((state) => state.product);

  // Valores base y cálculo de SOLD (constante)
  const { initial, incoming, sold, maxAllowed } = useMemo(() => {
    const initial = product?.initial_products || 0;
    const incoming = product?.incoming_products || 0;
    const currentFinal = product?.final_products || 0;
    const currentLosses = product?.losses || 0;

    // SOLD se calcula UNA VEZ y se mantiene CONSTANTE
    // sold = initial + incoming - losses - final_products
    const sold = initial + incoming - currentLosses - currentFinal;

    // Máximo permitido para pérdidas (no puede afectar lo vendido)
    const maxAllowed = Math.max(0, initial + incoming - sold);

    return {
      initial,
      incoming,
      currentFinal,
      currentLosses,
      sold,
      maxAllowed,
    };
  }, [product]);

  // Función de validación mejorada
  const validateLosses = (value: number) => {
    if (value < 0) {
      return 'Las pérdidas no pueden ser negativas';
    }

    if (value > maxAllowed) {
      return `Las pérdidas no pueden exceder ${maxAllowed.toFixed(2)}`;
    }

    // Verificar que el stock final no sea negativo
    const resultingFinal = initial + incoming - sold - value;
    if (resultingFinal < 0) {
      return `El stock final no puede ser negativo. Máximo: ${maxAllowed.toFixed(2)}`;
    }

    return true;
  };

  // Esquema de validación actualizado
  const updatedSchema = LossesUpdateSchema.refine(
    (data) => {
      const finalProducts = initial + incoming - sold - data.losses;
      return finalProducts >= 0;
    },
    {
      message: 'El stock final no puede ser negativo',
      path: ['losses'],
    },
  ).refine((data) => data.losses <= maxAllowed, {
    message: `Las pérdidas no pueden exceder ${maxAllowed.toFixed(2)}`,
    path: ['losses'],
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm<LossesUpdateFormData>({
    resolver: zodResolver(updatedSchema),
    defaultValues: {
      losses: product?.losses || 0,
    },
    mode: 'onChange',
  });

  const lossesValue = watch('losses', 0);

  // Calcular nuevos final_products basado en las pérdidas
  const calculatedFinal = useMemo(() => {
    const newLosses = Number(lossesValue) || 0;

    // Fórmula clave: final_products = initial + incoming - sold - losses
    // Esto garantiza que sold se mantenga constante
    return initial + incoming - sold - newLosses;
  }, [lossesValue, initial, incoming, sold]);

  // Efecto para validar en tiempo real cuando cambian los valores
  useEffect(() => {
    if (lossesValue !== undefined) {
      trigger('losses');
    }
  }, [lossesValue, trigger, initial, incoming, sold]);

  // Efecto para resetear el valor cuando cambia el producto
  useEffect(() => {
    if (product) {
      setValue('losses', product.losses || 0, { shouldValidate: true });
    }
  }, [product, setValue]);

  return {
    watch,
    register: {
      ...register,
      losses: register('losses', {
        validate: validateLosses,
        valueAsNumber: true,
        min: {
          value: 0,
          message: 'Las pérdidas no pueden ser negativas',
        },
        max: {
          value: maxAllowed,
          message: `Las pérdidas no pueden exceder ${maxAllowed.toFixed(2)}`,
        },
      }),
    },
    handleSubmit,
    errors,
    setValue,
    finalProducts: calculatedFinal,
    product,
    isValid:
      isValid &&
      calculatedFinal >= 0 &&
      lossesValue >= 0 &&
      lossesValue <= maxAllowed,
    maxAllowed,
    sold,
  };
}
