import { useQuery } from '@tanstack/react-query';
import { productdb } from '../models/product.database';

export const useProducts = () => {
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['product-list'],
    queryFn: productdb.getAll,
  });

  return { products: data, isLoading, error, refetch };
};
