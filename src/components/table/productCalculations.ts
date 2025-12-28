import { ProductType } from '../../models/models';
import { InterfaceProduct } from '../../store/inventoryActions';

export interface ProcessedProduct extends ProductType {
  available_products: number;
  final_products: number;
  sold_products: number;
  total_cash: number;
  salesPercentage: number;
}

export interface Totals {
  initial_products: number;
  incoming_products: number;
  losses: number;
  available_products: number;
  final_products: number;
  sold_products: number;
  total_cash: number;
}

export const calculateDynamicValues = (
  product: InterfaceProduct,
): ProcessedProduct => {
  const initial = product.initial_products || 0;
  const incoming = product.incoming_products || 0;
  const losses = product.losses || 0;
  const price = product.price || 0;
  const available = initial + incoming - losses;
  let final =
    product.final_products == null ? available : product.final_products;
  const sold = available - final;
  const totalCash = sold * price;
  const salesPercentage = available > 0 ? (sold / available) * 100 : 0;

  return {
    ...product,
    available_products: available,
    final_products: final,
    sold_products: sold,
    total_cash: totalCash,
    salesPercentage,
  };
};
