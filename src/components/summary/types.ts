export interface ProcessedProductsTypes {
  id?: number; // Optional since this will be auto-incremented
  code: string;
  name: string;
  unit: string;
  cost: number;
  price: number; // Se representa como número, puede ser convertido a Decimal si es necesario
  initial_products: number;
  incoming_products: number;
  losses: number;
  final_products: number | null;
  created_at: string | number | Date;
  updated_at: string | number | Date;
  initial: number;
  incoming: number;
  sold: number;
  final: number;
  available: number;
  soldPercentage: number;
  finalPercentage: number;
}

export const initialProduct: ProcessedProductsTypes = {
  id: undefined,
  code: ' -- ',
  name: '',
  unit: '',
  cost: 0.0,
  price: 0.0,
  initial_products: 0,
  incoming_products: 0,
  losses: 0,
  final_products: null,
  initial: 0,
  incoming: 0,
  sold: 0,
  final: 0,
  available: 0,
  soldPercentage: 0,
  finalPercentage: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
