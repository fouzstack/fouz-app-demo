export const columns = [
  {
    id: 1,
    accessorKey: 'date',
    header: 'Fecha del Inventario',
  },
  {
    id: 2,
    accessorKey: 'total_sales_percentage',
    header: 'Ventas (%)',
  },
  {
    id: 3,
    accessorKey: 'total_revenue',
    header: 'Total de Ventas',
  },
  {
    id: 4,
    accessorKey: 'gross_profit',
    header: 'Ganancia Bruta',
  },
  {
    id: 5,
    accessorKey: 'total_cost',
    header: 'Costo de Inventario',
  },
  {
    id: 6,
    accessorKey: 'total_losses',
    header: 'Pérdidas',
  },
];

export interface IProducts {
  id: number;
  name: string;
  unit: string;
  cost: number;
  price: number;
  initial_products: number;
  incoming_products: number;
  losses: number;
  final_products: number;
  created_at: string;
  updated_at: string;
  available_products: number;
  sold_products: number;
  total_cash: number;
}

export interface InventoryMetrics {
  total_revenue: number;
  total_losses: number;
  total_cash: number;
  gross_profit: number;
  net_profit: number;
  gross_margin_percentage: number;
  investment: number;
  date: string;
  total_sales_percentage: number;
  total_cost: number;
  total_amount: number;
}
