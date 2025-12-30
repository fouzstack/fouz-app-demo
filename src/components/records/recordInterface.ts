export interface IProducts {
  id: number;
  code: string;
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
  salesPercentage: number;
}

export interface IInventory {
  seller: string;
  time: string;
  date: string;
  products: IProducts[];
  total: number;
  salesPercentage: number;
}

export const initialInventory = {
  seller: 'Administrasor',
  time: '04:56',
  date: '2025-02-09',
  products: [
    {
      id: 18442,
      code: ' -- ',
      name: 'Malta Bucanero',
      unit: 'u',
      cost: 180,
      price: 300,
      initial_products: 28,
      incoming_products: 12,
      losses: 0,
      final_products: 38,
      created_at: '2025-02-08T04:56:05.410Z',
      updated_at: '2025-02-24T03:10:33.008Z',
      available_products: 40,
      sold_products: 2,
      total_cash: 600,
      salesPercentage: 0,
    },
  ],
  total: 18981.75,
  salesPercentage: 0,
};
