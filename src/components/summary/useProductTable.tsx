import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import inventory from '../../models/inventorydb';
import { useMemo } from 'react';
import { normalizeProduct } from './normalizeProduct';

export function useProductTable() {
  const {
    data = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ['report-products'],
    queryFn: inventory.getInventory,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const [isSortedByFinal, setIsSortedByFinal] = useState(false); // State to toggle sorting

  const processedProducts = useMemo(() => {
    return normalizeProduct(data.products || [], isSortedByFinal);
  }, [data.products, isSortedByFinal]);

  return {
    processedProducts,
    isLoading,
    error,
    isSortedByFinal,
    setIsSortedByFinal,
  };
}
