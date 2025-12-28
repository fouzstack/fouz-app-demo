import { ProductType } from '../models/models';

export const calculateDynamicValues = (product: ProductType) => {
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

export const useProductFilter = (data: ProductType[]) =>
  data.map(calculateDynamicValues).sort((a, b) => a.name.localeCompare(b.name));
