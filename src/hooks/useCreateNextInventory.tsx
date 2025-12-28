import { useMutation, QueryClient } from '@tanstack/react-query';
import { CreateNextInventoryMutation } from './hooks.types';

const queryClient = new QueryClient();

export const useCreateNextInventory = (
  _mutationFn: CreateNextInventoryMutation,
  queryKey: string[], //For invalidating queries
) => {
  const mutation = useMutation({
    mutationFn: (seller: string) => {
      return _mutationFn(seller);
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
