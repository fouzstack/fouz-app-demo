import { useQuery } from '@tanstack/react-query';
import inventory from '../models/inventorydb';

export const useInventoryDate = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventory-date'],
    queryFn: inventory.getInventoryDate,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const date = data ? data : new Date();
  return { date, isLoading, error };
};
