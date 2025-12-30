import { useMutation, QueryClient } from '@tanstack/react-query';
import { ProductType } from './models';

export type MutationFunction = (data: Partial<ProductType>) => Promise<any>;

const queryClient = new QueryClient();

export const usePartialMutation = (_mutationFn: MutationFunction) => {
  const mutation = useMutation({
    mutationFn: (data: Partial<ProductType>) => {
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
