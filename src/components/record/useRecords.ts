import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { RecordsType } from '../../models/models';
import { getRecord } from '../../models/records';
import { normalizeProduct } from './normalizeProduct';

// Extiende UseQueryOptions sin incluir queryKey
interface UseRecordsOptions
  extends Omit<
    UseQueryOptions<
      RecordsType | null,
      Error,
      RecordsType | null,
      readonly ['records', number]
    >,
    'queryKey'
  > {}

export function useRecords(
  position: number = 0,
  options: UseRecordsOptions = {},
) {
  return useQuery({
    queryKey: ['records', position] as const, // Establece `queryKey` aquí
    queryFn: async () => {
      const record = await getRecord(position);
      //console.log(record)
      if (!record) return null;
      return {
        ...record,
        products: normalizeProduct(record.products),
      };
    },
    enabled: position >= 0 && position <= 9,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    ...options, // Propagar otras opciones del usuario (sin incluir `queryKey`)
  });
}
