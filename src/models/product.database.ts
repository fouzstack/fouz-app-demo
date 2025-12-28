import { acyncFunctionHandler } from './acyncFunctionHandler';
import { normalizeProduct, ProductType } from './models';
import { normalizeNames } from './utils';
import { db } from './models';

export const productdb = {
  save: async (product: ProductType) => {
    const updatedProduct = { ...product, updated_at: new Date() };
    return await acyncFunctionHandler(() => db.products.put(updatedProduct));
  },

  add: async (_product: ProductType) => {
    const normalizedProductName = normalizeNames(_product.name);
    const existingProduct = await db.products
      .where('name')
      .equalsIgnoreCase(normalizedProductName)
      .first();

    if (existingProduct) {
      return `${_product.name} ya existe. Escoja otro nombre de Producto!`;
    }

    const newProduct = normalizeProduct(_product);
    await acyncFunctionHandler(() => db.products.add(newProduct));
    return 'Productos creados con éxito!';
  },

  addMany: async (productsFromJson: ProductType[]) => {
    try {
      // Verificamos si ya existen productos en la base de datos
      const existingProducts = await db.products.toArray();

      // Unir productos existentes y nuevos
      let result =
        existingProducts.length > 0
          ? [...productsFromJson, ...existingProducts]
          : productsFromJson;
      db.products.clear();
      // Filtrar productos para obtener solo nombres únicos
      const filteredProducts = result.filter(
        (product, index, array) =>
          index ===
          array.findIndex(
            (p) => normalizeNames(p.name) === normalizeNames(product.name),
          ),
      );
      const FormattedProduct = filteredProducts.map((prod) =>
        normalizeProduct(prod),
      );
      // Guardar productos únicos en la base de datos
      await acyncFunctionHandler(() => db.products.bulkPut(FormattedProduct));
      return 'Productos creados exitosamente!';
    } catch (error) {
      console.error('Error al crear productos:', error);
      return 'Ocurrió un error al crear los productos.';
    }
  },

  updateProduct: async (id: number, updatedFields: Partial<ProductType>) => {
    const product = await db.products.get(id); // Obtiene el producto.

    const updatedProduct = {
      ...product,
      ...updatedFields,
      updated_at: new Date(), // Actualiza el campo 'updated_at'
    };
    // @ts-expect-error
    await db.products.put(updatedProduct); // Guarda el producto actualizado.
    return 'El producto se ha actualizado!';
  },

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

  available: (product: ProductType) =>
    product.initial_products || 0 + product.incoming_products - product.losses,

  //sold_products: (product: Product) => product.available( ) - _product.final(  ),

  //totalCash: (product: Product) => product.price * product.sold_products,
  existingProduct: async (created_at: Date) => {
    return await acyncFunctionHandler(() =>
      // @ts-expect-error
      db.product.where('created_at').equals(created_at).first(),
    );
  },
};
