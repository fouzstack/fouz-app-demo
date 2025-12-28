import { ProductType } from '../../models/models';

export const calculateDynamicValues = (product: ProductType) => {
  const initial = product.initial_products || 0;
  const incoming = product.incoming_products || 0;

  const losses = product.losses || 0;
  const price = product.price || 0;
  const cost = product.cost || 0;

  const available = initial + incoming - losses; // "A la Venta"
  const final =
    product.final_products == null ? available : product.final_products;
  const sold = available - final; // "Final"
  const profit = price - cost;
  const loss = losses * cost;
  const total_profit = sold * profit; // "Importe"
  const net_profit = total_profit - loss; // "Importe"
  const salesPercentage = (sold / available) * 100 || 0; // Porcentaje de ventas
  //const totalCostAvailable = available * cost; // Costo total de productos disponibles
  const totality = price * sold;
  const total_cost = (initial + incoming) * cost;

  return {
    ...product,
    loss: loss,
    totality,
    available,
    total_cost,
    profit: profit,
    sold_products: sold,
    net_profit,
    total_profit: total_profit.toFixed(2),
    profits_total: total_profit,
    salesPercentage: salesPercentage,
  };
};

export const normalizeProduct = (data: ProductType[]) =>
  data
    ?.map(calculateDynamicValues)
    .sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name),
    );
