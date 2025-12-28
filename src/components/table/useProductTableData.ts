//@ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { useMemo, useEffect } from 'react';
import inventory from '../../models/inventorydb';
import { useProductStore } from '../../store/store';
import { useInventoryStore } from '../../store/inventoryStore';
import {
  calculateDynamicValues,
  ProcessedProduct,
  Totals,
} from './productCalculations';
import { InterfaceProduct } from '../../store/inventoryActions';

interface UseProductTableDataReturn {
  products: ProcessedProduct[];
  totals: Totals;
  averageSalesPercentage: number;
  handleRowClick: (product: InterfaceProduct) => void;
}

export const useProductTableData = (): UseProductTableDataReturn => {
  const { data = {} } = useQuery<{ products?: InterfaceProduct[] }>({
    queryKey: ['inventory-one'],
    queryFn: inventory.getInventory,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const processedProducts: InterfaceProduct[] = useMemo(() => {
    if (!data.products) return [];
    return data.products
      .map(calculateDynamicValues)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data.products]);

  const dispatch = useProductStore((state) => state.dispatch);
  const inventoryDispatch = useInventoryStore((state) => state.dispatch);

  useEffect(() => {
    if (data) {
      inventoryDispatch({
        type: 'SET_INVENTORY',
        payload: { ...data, products: processedProducts },
      });
    }
  }, [data, processedProducts, inventoryDispatch]);

  const totals: Totals = useMemo(() => {
    return processedProducts.reduce(
      (acc, product) => ({
        initial_products:
          acc.initial_products + (product.initial_products || 0),
        incoming_products:
          acc.incoming_products + (product.incoming_products || 0),
        losses: acc.losses + (product.losses || 0),
        available_products:
          acc.available_products + (product.available_products || 0),
        final_products: acc.final_products + (product.final_products || 0),
        sold_products: acc.sold_products + (product.sold_products || 0),
        total_cash: acc.total_cash + (product.total_cash || 0),
      }),
      {
        initial_products: 0,
        incoming_products: 0,
        losses: 0,
        available_products: 0,
        final_products: 0,
        sold_products: 0,
        total_cash: 0,
      },
    );
  }, [processedProducts]);

  const averageSalesPercentage: number = useMemo(() => {
    if (!processedProducts.length) return 0;
    return (
      processedProducts.reduce((acc, p) => acc + (p.salesPercentage || 0), 0) /
      processedProducts.length
    );
  }, [processedProducts]);

  const handleRowClick = (product: ProcessedProduct): void => {
    dispatch({ type: 'SET_PRODUCT', payload: product });
  };

  return {
    products: processedProducts,
    totals,
    averageSalesPercentage,
    handleRowClick,
  };
};
