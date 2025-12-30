import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { normalizeProduct } from './normalizeProduct';
import { recordsdb } from '../../models/records.database';
import { RecordsType } from '../../models/models';

export function useProductTable() {
  const { data = [] } = useQuery({
    queryKey: ['inventories-records'],
    queryFn: recordsdb.getAll,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const inventories = useMemo(() => {
    const normalizedInventories = data.map((ipv: RecordsType) => ({
      seller: ipv.seller,
      time: ipv.time,
      date: ipv.date,
      products: normalizeProduct(ipv.products),
      total: normalizeProduct(ipv.products).reduce(
        (acc, product) => acc + product.total_cash,
        0,
      ),
      salesPercentage:
        normalizeProduct(ipv.products).reduce(
          (acc, product) => acc + product.salesPercentage,
          0,
        ) / ipv.products.length,
    }));

    return normalizedInventories.sort(
      (
        a: { date: string | number | Date },
        b: { date: string | number | Date },
      ) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // Verifica si las fechas son válidas
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          // Maneja el caso en que una o ambas fechas no son válidas
          return 0; // O, según tu lógica, puedes decidir cómo debería ser su orden.
        }

        return dateB.getTime() - dateA.getTime(); // Ordena por fecha (más reciente primero)
      },
    );
  }, [data]);
  //console.log(inventories)
  return { inventories };
}
