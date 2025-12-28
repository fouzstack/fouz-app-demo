import { ProductType } from '../../models/models';

export const calculateDynamicValues = (product: ProductType) => {
  const initial = product.initial_products || 0;
  const incoming = product.incoming_products || 0;

  const losses = product.losses || 0;
  const price = product.price || 0;

  const available = initial + incoming - losses; // "A la Venta"

  const final =
    product.final_products == null ? available : product.final_products;
  const sold = available - final; // "Final"
  const totalCash = sold * price; // "Importe"
  const salesPercentage = (sold / available) * 100 || 0; // Porcentaje de ventas

  return {
    ...product,
    available_products: available,
    final_products: final,
    sold_products: sold,
    total_cash: totalCash,
    salesPercentage,
  };
};

export const normalizeProduct = (data: ProductType[]) =>
  data
    ?.map(calculateDynamicValues)
    .sort((a: { name: string }, b: { name: any }) =>
      a.name.localeCompare(b.name),
    );
