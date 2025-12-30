import { ProductType } from '../../models/models';

// Función para detectar si hay ganancia negativa en un producto
function hasNegativeProfit(price: number, cost: number): boolean {
  return price - cost < 0;
}

export interface InventoryMetrics {
  products: ProductType[];
  totalProducts: number;
  totalSold: number;
  totalLosses: number;
  totalOutOfStock: number;
  totalMonetaryLost: number;
  totalNetProceeds: number;
  totalCash: number;
  totalTheoricProceeds: number;
  productsWithLosses: ProductType[];
  totalWithSales: number;
  totalWithEntries: number;
  productsWithEntries: ProductType[];
  productsOutOfStock: ProductType[];
  productsWithNegativeProfit: ProductType[];
  totalInvestment: number; // Añadido totalInvestment
}

export function useInventoryMetrics(products: ProductType[]): InventoryMetrics {
  let totalSold = 0;
  let totalLosses = 0;
  let totalOutOfStock = 0;
  let totalMonetaryLost = 0;
  let totalNetProceeds = 0;
  let totalCash = 0;
  let totalTheoricProceeds = 0;
  const productsWithLosses: ProductType[] = [];
  const productsWithNegativeProfit: ProductType[] = [];
  let totalWithSales = 0;
  let totalWithEntries = 0;
  const productsWithEntries: ProductType[] = [];
  const productsOutOfStock: ProductType[] = [];
  let totalInvestment = 0; // Nueva variable para inversión total

  products.forEach((product) => {
    const initial = product.initial_products ?? 0;
    const incoming = product.incoming_products ?? 0;
    const losses = product.losses ?? 0;
    const price = product.price ?? 0;
    const cost = product.cost ?? 0;

    // Detectar ganancia negativa con la función auxiliar
    if (hasNegativeProfit(price, cost)) {
      productsWithNegativeProfit.push(product);
    }

    const monetaryLost = losses * cost;
    const available = initial + incoming - losses;

    // Ganancia teórica si todos los productos disponibles se vendieran
    const theoricProceeds = (price - cost) * available;
    totalTheoricProceeds += theoricProceeds;
    const final =
      product.final_products == null ? available : product.final_products;
    const sold = available - final;
    const proceeds = (price - cost) * sold;
    const netProceeds = proceeds - monetaryLost;
    const totalCashProduct = sold * price;

    // Cálculo inversión producto
    const investmentProduct = final * cost;
    totalInvestment += investmentProduct;

    if (sold > 0) {
      totalSold += sold;
      totalWithSales++;
    }
    if (losses > 0) {
      totalLosses += losses;
      productsWithLosses.push(product);
    }
    if (final === 0) {
      totalOutOfStock++;
      productsOutOfStock.push(product);
    }
    if (incoming > 0) {
      totalWithEntries++;
      productsWithEntries.push(product);
    }
    totalMonetaryLost += monetaryLost;
    totalNetProceeds += netProceeds;
    totalCash += totalCashProduct;
  });

  return {
    products,
    totalProducts: products.length,
    totalSold,
    totalLosses,
    totalOutOfStock,
    totalMonetaryLost,
    totalNetProceeds,
    totalCash,
    totalTheoricProceeds,
    productsWithLosses,
    totalWithSales,
    totalWithEntries,
    productsWithEntries,
    productsOutOfStock,
    productsWithNegativeProfit,
    totalInvestment, // Retornamos la nueva métrica
  };
}
