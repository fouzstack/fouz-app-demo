import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTableModalMutation } from '../../hooks/useTableModalMutation';
import { updateInventoryTable } from '../../models/inventorydb';

export function useInventoryMutation(productId: number) {
  const { mutation } = useTableModalMutation(productId, updateInventoryTable);
  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success(mutation.data.message || 'Producto actualizado.');
    } else if (mutation.isError) {
      toast.error(`Error al actualizar: ${mutation.error}`);
    }
  }, [mutation]);
  return mutation;
}
