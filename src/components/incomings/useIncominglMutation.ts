import { useMutation, QueryClient } from '@tanstack/react-query';
import { ProductType } from '../../models/models';

export type MutationFunction = (
  id: number,
  data: Partial<ProductType>,
) => Promise<any>;

const queryClient = new QueryClient();

export const useIncominglMutation = (
  id: number,
  _mutationFn: MutationFunction,
) => {
  const mutation = useMutation({
    mutationFn: (data: Partial<ProductType>) => {
      return _mutationFn(id, data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['products', 'inventory-one'],
      });
    },
    //mutationKey: 'mutated-products',
  });
  return { mutation };
};
