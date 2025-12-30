import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
} from '../services/http-functions';

// GET Hook
export const useHttpGet = <T>(
  url: string,
  enabled = true,
): UseQueryResult<T, Error> => {
  return useQuery<T, Error>({
    queryKey: [url],
    queryFn: () => httpGet<T>(url),
    enabled,
  });
};

// POST Hook
type PostParams = { url: string; data: unknown };

export const useHttpPost = <T>(): UseMutationResult<T, Error, PostParams> => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, PostParams>({
    mutationFn: ({ url, data }) => httpPost<T>(url, data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

// PUT Hook
type PutParams = { url: string; data: unknown };

export const useHttpPut = <T>(): UseMutationResult<T, Error, PutParams> => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, PutParams>({
    mutationFn: ({ url, data }) => httpPut<T>(url, data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

// DELETE Hook
export const useHttpDelete = <T>(): UseMutationResult<T, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, string>({
    mutationFn: (url) => httpDelete<T>(url),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};
