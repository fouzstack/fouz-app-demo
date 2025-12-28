import { useMutation, QueryClient } from '@tanstack/react-query';
import { ServerActionsMutation } from './hooks.types';

const queryClient = new QueryClient();

export const useServerActionsMutation = (
  _mutationFn: ServerActionsMutation,
  queryKey: string[], //For invalidating queries
) => {
  const mutation = useMutation({
    mutationFn: () => {
      return _mutationFn();
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
