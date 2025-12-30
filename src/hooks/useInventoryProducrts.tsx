import { useQuery } from '@tanstack/react-query';
import inventory from '../models/inventorydb';

export const useInventoryProducts = () => {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['inventory-products'],
    queryFn: inventory.getAll,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { inventoryProducts: data, isLoading, error };
};
