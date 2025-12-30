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

  const processedProducts = useMemo(() => {
    return normalizeProduct(data.products || []);
  }, [data.products]);

  const totalCost = useMemo(() => {
    return processedProducts.reduce((acc, product) => {
      return (
        acc +
        (product.initial_products + product.incoming_products) * product.cost
      );
    }, 0);
  }, [processedProducts]);

  const totality = useMemo(() => {
    return processedProducts.reduce((acc, product) => {
      return acc + product.totality;
    }, 0);
  }, [processedProducts]);

  const totalSold = useMemo(() => {
    return processedProducts.reduce((acc, product) => {
      return acc + (product.sold_products || 0);
    }, 0);
  }, [processedProducts]);

  const loss = useMemo(() => {
    return processedProducts.reduce((acc, product) => {
      return acc + (product.loss || 0);
    }, 0);
  }, [processedProducts]);

  const totalSalesPercentage = useMemo(() => {
    const totalAvailable = processedProducts.reduce((acc, product) => {
      return acc + product.available;
    }, 0);
    return totalAvailable > 0 ? (totalSold / totalAvailable) * 100 : 0;
  }, [totalSold, processedProducts]);

  const totalSalesPercentageSum = useMemo(() => {
    return processedProducts.reduce((acc, product) => {
      return acc + (product.salesPercentage || 0);
    }, 0);
  }, [processedProducts]);

  const average_sales_percentage =
    processedProducts?.length > 0
      ? totalSalesPercentageSum / processedProducts.length
      : 0;

  const date = data?.date;
  return {
    date,
    processedProducts,
    totality,
    totalCost,
    totalSalesPercentage,
    average_sales_percentage,
    loss,
    isLoading,
    error,
  };
}
