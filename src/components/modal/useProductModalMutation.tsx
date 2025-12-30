import { useMutation, QueryClient } from '@tanstack/react-query';
import { ProductType } from '../../models/models';

export type MutationFunction = (
  product: ProductType,
) => Promise<
  'La entrada debe ser mayor que cero' | 'Producto actualizado correctamente'
>;

const queryClient = new QueryClient();

export const useProductModalMutation = (_mutationFn: MutationFunction) => {
  const mutation = useMutation({
    mutationFn: (data: ProductType) => {
      return _mutationFn(data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    //mutationKey: 'mutated-products',
  });
  return { mutation };
};
