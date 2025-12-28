import { useMutation, QueryClient } from '@tanstack/react-query';
import { BulkCreateProductMutation } from './hooks.types';
import { ProductType } from '../models/models';

const queryClient = new QueryClient();

export const useBulkCreateProducts = (
  data: ProductType[],
  _mutationFn: BulkCreateProductMutation,
  queryKey: string[], //For invalidating queries
) => {
  const mutation = useMutation({
    mutationFn: () => {
      return _mutationFn(data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
    //onSettled: () => queryClient.invalidateQueries({ queryKey: queryKey }),
    //mutationKey: mutationKey,
  });
  return { mutation };
};
