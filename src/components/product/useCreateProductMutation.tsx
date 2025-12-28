import { useMutation, QueryClient } from '@tanstack/react-query';
import { MutationCreateFunction } from '../../hooks.types';
import { ProductType } from '../../models/models';

const queryClient = new QueryClient();

export const useGenericMutation = (
  _mutationFn: MutationCreateFunction,
  queryKey: string[], //For invalidating queries
) => {
  const mutation = useMutation({
    mutationFn: (payload: ProductType) => {
      return _mutationFn(payload, queryKey);
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
