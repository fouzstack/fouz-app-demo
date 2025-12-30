import { IProducts, InventoryMetrics } from './columns';

export function normalizeProduct(products: IProducts[]): InventoryMetrics[] {
  return products.map((product) => {
    const initial_products = product.initial_products;
    const incoming_products = product.incoming_products;
    const losses = product.losses;
    const available = initial_products + incoming_products - losses; // "A la Venta"
    const final_products = product.final_products;
    const sold_products =
      final_products !== null ? available - final_products : 0; // "Final"

    const total_sales_percentage =
      sold_products > 0 ? (sold_products / available) * 100 : 0; // Porcentaje de ventas
    const total_cash = sold_products * product.price; // "Importe"
    const total_amount = available - product.losses;
    const total_cost = product.cost * (initial_products + incoming_products); // Costo total según cantidad
    const total_losses = losses * product.cost;
    const investment = product.cost * (initial_products + incoming_products); // Inversión total
    const total_revenue = product.price * sold_products; // Ingresos totales generados

    const inventory_on_hand = available - sold_products;
    const gross_profit = (product.price - product.cost) * sold_products;
    // Calculo del margen bruto porcentual
    const gross_margin_percentage = (gross_profit / total_revenue) * 100 || 0;
    const net_profit = gross_profit - total_losses;
    return {
      date: product.created_at, // Ajusta según cómo manejes la fecha.
      total_sales_percentage,
      total_cost,
      total_amount: total_amount,
      gross_margin_percentage,
      inventory_on_hand,
      total_losses,
      total_cash,
      total_revenue,
      gross_profit,
      net_profit,
      investment,
    };
  });
}
