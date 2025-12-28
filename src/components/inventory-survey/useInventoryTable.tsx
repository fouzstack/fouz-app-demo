import { useQuery } from '@tanstack/react-query';
import { recordsdb } from '../../models/records.database';
import { normalizeProduct } from './normalizeProducts';
import { InventoryMetrics, IProducts } from './columns';
import { useMemo } from 'react';

export function useInventoryTable() {
  const { data = [] } = useQuery({
    queryKey: ['records-products'],
    queryFn: recordsdb.getAll,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const {
    inventories,
    net_profit,
    total_cash,
    total_cost,
    total_losses,
    total_sales_percentage,
    average_sales_percentage,
  } = useMemo(() => {
    const inventoriesData = data.map(
      (ipv: { date: string; products: IProducts[] }) => {
        const normalizedProducts = normalizeProduct(ipv.products);

        const total_cost = normalizedProducts.reduce(
          (acc: number, product) => acc + product.total_cost,
          0,
        );
        const total_amount = normalizedProducts.reduce(
          (acc, product) => acc + product.total_amount,
          0,
        );
        const total_revenue = normalizedProducts.reduce(
          (acc, product) => acc + product.total_revenue,
          0,
        );

        const total_losses = normalizedProducts.reduce(
          (acc, product) => acc + product.total_losses,
          0,
        );
        const total_cash = normalizedProducts.reduce(
          (acc, product) => acc + product.total_cash,
          0,
        );
        const gross_profit = normalizedProducts.reduce(
          (acc, product) => acc + product.gross_profit,
          0,
        );
        const gross_margin_percentage =
          normalizedProducts.reduce(
            (acc, product) => acc + product.gross_margin_percentage,
            0,
          ) / normalizedProducts.length || 0;

        const total_investment = normalizedProducts.reduce(
          (acc, product) => acc + product.investment,
          0,
        );
        const net_profit = normalizedProducts.reduce(
          (acc, product) => acc + product.net_profit,
          0,
        );

        return {
          date: ipv.date,
          total_sales_percentage:
            normalizedProducts.reduce(
              (acc, product) => acc + product.total_sales_percentage,
              0,
            ) / normalizedProducts.length,
          total_cost,
          total_amount,
          gross_margin_percentage,
          total_losses,
          gross_profit,
          net_profit,
          total_cash,
          total_revenue,
          total_investment,
        };
      },
    );

    // Calculate total cash and total sales percentage
    const total_cash_sum = inventoriesData.reduce(
      (acc: number, inventory: InventoryMetrics) => acc + inventory.total_cash,
      0,
    );
    const total_sales_percentage_sum = inventoriesData.reduce(
      (acc: number, inventory: InventoryMetrics) =>
        acc + inventory.total_sales_percentage || 0,
      0,
    );

    const net_profit = inventoriesData.reduce(
      (acc: number, inventory: InventoryMetrics) =>
        acc + inventory.net_profit || 0,
      0,
    );
    // Calculate average sales percentage
    const average_sales_percentage =
      inventoriesData.length > 0
        ? total_sales_percentage_sum / inventoriesData.length
        : 0;
    const total_cost = inventoriesData.reduce(
      (acc: number, inventory: InventoryMetrics) =>
        acc + inventory.total_cost || 0,
      0,
    );
    const total_losses = inventoriesData.reduce(
      (acc: number, inventory: InventoryMetrics) =>
        acc + inventory.total_losses || 0,
      0,
    );

    return {
      inventories: inventoriesData,
      net_profit: net_profit,
      total_cost: total_cost,
      total_losses,
      total_cash: total_cash_sum,
      total_sales_percentage: total_sales_percentage_sum,
      average_sales_percentage,
    };
  }, [data]);

  return {
    inventories,
    total_cost,
    total_cash,
    total_losses,
    net_profit,
    total_sales_percentage,
    average_sales_percentage,
  };
}
