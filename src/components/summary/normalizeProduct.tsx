import { ProductType } from '../../models/models';

export const calculateDynamicValues = (product: ProductType) => {
  const price = product.price;
  const initial = product.initial_products;
  const incoming = product.incoming_products;
  const losses = product.losses || 0;
  const code = product.code || ' --- ';
  const name = product.name || 'producto';
  const going = initial + incoming - losses; // "A la Venta"
  const finals = product.final_products;
  const final = finals == null ? going : finals;
  const sold = going - final; // "Final"
  const available = initial + incoming - losses;
  const finalPercentage = (final / available) * 100 || 0;
  const soldPercentage = (sold / available) * 100 || 0;

  return {
    ...product,
    price,
    initial,
    incoming,
    code,
    sold,
    final,
    name,
    available,
    finalPercentage,
    soldPercentage,
  };
};

// Normalize and sort products
export const normalizeProduct = (
  data: ProductType[],
  isSortedByFinal: boolean,
) => {
  const sortedData = data.map(calculateDynamicValues);

  return sortedData.sort((a, b) => {
    return isSortedByFinal ? a.final - b.final : a.name.localeCompare(b.name);
  });
};
