//import { ProductType } from '../../models/models';

type ProductType = {
  code: string;
  name: string;
  initial_products: number;
  incoming_products: number;
  losses: number;
  available_products?: number;
  final_products?: number | null;
  sold_products?: number;
  price: number;
  total_cash?: number;
};

export const normalizeProduct = (product: ProductType) => {
  return {
    Código: product.code || '',
    Producto: product.name || '',
    Inicial: product.initial_products,
    Entrada: product.incoming_products,
    Ajuste: product.losses,
    Venta: product.available_products,
    Finales: product.final_products,
    Vendido: product.sold_products,
    Precio: product.price,
    Importe: product.total_cash,
  };
};

export const normalizedProduct = (data: ProductType[]) =>
  data
    .map(normalizeProduct)
    //.filter((_product: ProductType) => productdb.available(_product) > 0) // Solo mostrar productos disponibles
    .sort((a: { Producto: string }, b: { Producto: string }) =>
      a.Producto.localeCompare(b.Producto),
    ); // Ordenar por nombre
