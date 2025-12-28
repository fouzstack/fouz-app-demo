import { useQuery } from '@tanstack/react-query';
import { QueryFunction, ProductI } from './hooks.types.ts';

export const useGetProductQuery = (
  id: number,
  queryFunction: QueryFunction,
  queryKey: string[],
) => {
  const { isSuccess, isPending, isError, data, error, refetch } =
    useQuery<ProductI>({
      queryKey: [queryKey],
      queryFn: () => queryFunction(id),
    });

  return { isSuccess, isPending, isError, data, error, refetch };
};
