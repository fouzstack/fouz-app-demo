//@ts-nochec
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProductStore } from '../../store/store';
import {
  UpdateInventoryProductFormData,
  UpdateInventoryProductSchema,
} from '../../schemas/product.schema';

export function useUpdateProductForm() {
  const product = useProductStore((state) => state.product);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<UpdateInventoryProductFormData>({
    resolver: zodResolver(UpdateInventoryProductSchema),
    defaultValues: {},
  });

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    setError,
    product,
  };
}
