import { useMutation, QueryClient } from '@tanstack/react-query';
import { ProductType } from '../models/models';

export type MutationFunction = (
  id: number,
  data: Partial<ProductType>,
) => Promise<any>;

const queryClient = new QueryClient();

export const usePartialMutation = (
  id: number,
  _mutationFn: MutationFunction,
) => {
  const mutation = useMutation({
    mutationFn: (data: Partial<ProductType>) => {
      return _mutationFn(id, data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    //mutationKey: 'mutated-products',
  });
  return { mutation };
};
