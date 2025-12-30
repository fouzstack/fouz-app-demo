import { ProductType } from '../../models/models';
import { roundTwo } from '../helpers';

// Function to calculate dynamic values for a single product
export const calculateDynamicValues = (product: ProductType) => {
  const initial = product.initial_products || 0;
  const incoming = product.incoming_products || 0;
  const losses = product.losses || 0;
  const price = roundTwo(product.price) || 0;
  const available = roundTwo(initial + incoming - losses) || 0; // "A la Venta"

  const final =
    product.final_products == null ? available : product.final_products || 0;
  const sold = available - final; // "Final"
  const totalCash = roundTwo(sold * price) || 0; // Use roundTwo to avoid inconsistencies
  const salesPercentage =
    sold !== 0 && available !== 0 ? (sold / available) * 100 : 0; // Calculate sales percentage

  return {
    ...product,
    available_products: available,
    final_products: final,
    sold_products: sold,
    total_cash: totalCash,
    salesPercentage,
  };
};

// Function to normalize and sort products
export const normalizeProduct = (data: ProductType[]) =>
  data
    ?.map(calculateDynamicValues)
    .sort((a: { name: string }, b: { name: any }) =>
      a.name.localeCompare(b.name),
    );
