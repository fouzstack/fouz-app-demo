import { Product } from '../product.types';
import { acyncFunctionHandler } from './acyncFunctionHandler';
import { db } from './models';
import { productdb } from './product.database';
import { InternationalDateFormater } from './utils';

// Funciones de acceso a la base de datos para Products
export const product = {
  InternationalDateFormater: InternationalDateFormater,
  save: productdb.save,
  add: productdb.add,
  addMany: productdb.addMany,
  updateProduct: productdb.updateProduct,
  delete: async (id: number | undefined) => {
    return await acyncFunctionHandler(() => db.products.delete(id));
  },
  deleteAll: async () => {
    return await acyncFunctionHandler(() => db.products.clear());
  },
  getById: async (id: number | undefined) => {
    return await acyncFunctionHandler(() => db.products.get(id));
  },
  getAll: async () => {
    return await acyncFunctionHandler(() => db.products.toArray());
  },

  available: (product: Product) =>
    product.initial_products + product.incoming_products - product.losses,
  final: (
    product: Product, // @ts-expect-error
  ) => product.available(product) - product.sold_products,
  //sold_products: (product: Product) => product.available( ) - _product.final(  ),
  //totalCash: (product: Product) => product.price * product.sold_products,
  existingProduct: async (created_at: Date) => {
    return await acyncFunctionHandler(() =>
      // @ts-expect-error
      db.product.where('created_at').equals(created_at).first(),
    );
  },
};

export type ProductMethsProps = typeof product;
