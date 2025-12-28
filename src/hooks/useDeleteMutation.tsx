import { useMutation, QueryClient } from '@tanstack/react-query';

export type DeleteFunction = (id: number | undefined) => Promise<any>;

const queryClient = new QueryClient();

export const useDeleteMutation = (
  id: number | undefined,
  _mutationFn: DeleteFunction,
) => {
  const mutation = useMutation({
    mutationFn: () => {
      return _mutationFn(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-list'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    //mutationKey: 'mutated-products',
  });
  return { mutation };
};
