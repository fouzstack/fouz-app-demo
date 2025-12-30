import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInventorySeller } from '../models/inventorydb';

export function useUpdateInventorySeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seller: string) => updateInventorySeller(seller),

    onSuccess: () => {
      // Invalidar o refrescar la cache del inventario con id 1
      queryClient.invalidateQueries();
    },
  });
}

//How to use it
//const { mutate, isLoading, isError, error, isSuccess } = useUpdateInventorySeller();
