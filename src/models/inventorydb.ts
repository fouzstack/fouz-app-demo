import { db, InventoryType, ProductType } from './models';
import { formatearFecha } from './utils';
import { acyncFunctionHandler } from './acyncFunctionHandler';

export async function updateInventorySeller(newSeller: string): Promise<void> {
  const now = new Date();
  // Formatear la hora en formato "h:mm AM/PM"
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const time = `${hour12}:${formattedMinutes} ${ampm}`;
  // Formatear la fecha usando formatearFecha o manualmente a "dia-mes-año"
  // Si formatearFecha no está disponible o no hace esto, puedes usar:
  // const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
  const date = formatearFecha(now); // Asumiendo que devuelve "dia-mes-año"

  await db.inventory.update(1, {
    seller: newSeller,
    time,
    date,
    updated_at: now.toISOString(),
  });
}

// Crear el objeto inventorydb
const inventory = {
  async getInventoryDate() {
    try {
      const inventory = await db.inventory.get(1); // Suponiendo que el inventario tiene siempre ID 1
      if (!inventory || !inventory.products) {
        return 'Crear Inventario';
      }
      const date = inventory.date;
      return formatearFecha(date);
    } catch (error) {
      //@ts-expect-error
      return `Error al guardar el Producto!. ${error.message}`;
    }
  },
  getInventory: async () => {
    return await acyncFunctionHandler(() =>
      db.inventory.get(1).then((inv) => inv || {}),
    );
  },
  getAll: async () => {
    return await acyncFunctionHandler(() =>
      db.inventory.get(1).then((inv) => inv?.products || []),
    );
  },
  async get(productId: number) {
    try {
      const inventory = await db.inventory.get(1);
      if (!inventory || !inventory.products) {
        throw new Error(
          `Producto con id: ${productId} no encontrado en el inventario.`,
        );
      }
      const product = inventory.products.find((p) => p.id === productId);
      if (!product) {
        throw new Error(
          `Producto con id: ${productId} no encontrado en el inventario.`,
        );
      }
      return product;
    } catch (error) {
      //@ts-expect-error
      return { message: `${error.message}` };
    }
  },
  async replaceInventory(newInventory: InventoryType) {
    try {
      // Borrar el inventario actual
      await db.inventory.delete(1);

      // Filtrar las propiedades del nuevo inventario
      const filteredInventory = {
        id: 1, // Asegurarse de que el ID sea 1
        date: newInventory.date,
        seller: newInventory.seller,
        time: newInventory.time,
        products: newInventory.products.map((product) => ({
          id: product.id,
          code: product.code,
          name: product.name,
          unit: product.unit,
          cost: product.cost,
          price: product.price,
          initial_products: product.initial_products,
          incoming_products: product.incoming_products,
          losses: product.losses,
          final_products: product.final_products,
          created_at: product.created_at,
          updated_at: product.updated_at,
        })),
        created_at: newInventory.created_at,
        updated_at: newInventory.updated_at,
      };

      // Guardar el nuevo inventario
      await db.inventory.put(filteredInventory); // Reemplaza o inserta con el mismo ID

      return 'Inventario reemplazado correctamente';
    } catch (error) {
      // Retornar el error
      //@ts-expect-error
      return `Error al reemplazar el inventario. ${error.message}`;
    }
  },

  async update(productId: number, updatedFields: Partial<ProductType>) {
    //console.log(productId);
    try {
      const inventory = await db.inventory.get(1);

      if (!inventory || !inventory.products) {
        throw new Error('Inventario no encontrado o sin productos.');
      }
      const index = inventory.products.findIndex(
        (product) => product.id === productId,
      );
      if (index === -1) {
        throw new Error(
          `Producto con id: ${productId} no encontrado en el inventario.`,
        );
      }

      // Se actualizan solo los campos permitidos
      const updatedProduct = {
        ...inventory.products[index],
        ...updatedFields, // Actualiza solo los campos proporcionados
        updated_at: new Date(),
      };
      // Realizamos la actualización
      const updatedProducts = [...inventory.products];
      updatedProducts[index] = updatedProduct;

      // Actualizamos el inventario
      await db.inventory.update(1, { products: updatedProducts });

      return 'Producto en inventario actualizado exitosamente.';
    } catch (error) {
      //@ts-expect-error
      return { success: false, message: error.message };
    }
  },

  async deleteProduct(productId: number | undefined) {
    try {
      const inventory = await db.inventory.get(1);
      if (!inventory || !inventory.products) {
        throw new Error('Inventario no encontrado o sin productos.');
      }
      const updatedProducts = inventory.products.filter(
        (p) => p.id !== productId,
      );
      // Verificamos si se realizó algún cambio
      if (updatedProducts.length === inventory.products.length) {
        throw new Error('Producto no encontrado en el inventario.');
      }

      // Actualizamos el inventario
      await db.inventory.update(1, { products: updatedProducts });

      return 'Producto eliminado del inventario exitosamente.';
    } catch (error) {
      //@ts-expect-error
      return error.message;
    }
  },

  async deleteAll() {
    try {
      const inventory = await db.inventory.get(1);
      if (!inventory) {
        throw new Error('Inventario no encontrado.');
      }
      // Reiniciamos los productos a un array vacío
      //await db.inventory.update(1, { products: [] });
      await db.inventory.clear();
      return 'Todos los productos eliminados del inventario exitosamente.';
    } catch (error) {
      //@ts-expect-error
      return error.message;
    }
  },
};

export async function updateInventoryTable(
  productId: number,
  updatedFields: Partial<ProductType>,
) {
  try {
    const inventory = await db.inventory.get(1);

    if (!inventory || !inventory.products) {
      throw new Error(
        `Producto con id: ${productId} no encontrado en el inventario.`,
      );
    }
    const index = inventory.products.findIndex(
      (product) => product.id === productId,
    );
    /*if (index === -1) {
      throw new Error(`Producto con id: ${ productId } no encontrado en el inventario.`);
    }*/
    // Copiamos el producto original para modificarlo
    const originalProduct = inventory.products[index];
    // Se actualizan solo los campos permitidos
    /*
    if (updatedFields.hasOwnProperty('incoming_products')) {
      const incomingValue = updatedFields.incoming_products || 0; // Valor recibido en updatedFields
      const currentIncoming = originalProduct.incoming_products || 0; // Valor actual en DB

      if (incomingValue > 0) {
        // Suma el valor recibido al almacenado en DB
        updatedFields.incoming_products = currentIncoming + incomingValue;
      } 
    }
    */
    const updatedProduct = {
      ...originalProduct,
      ...updatedFields, // Actualiza solo los campos proporcionados
      updated_at: new Date(),
    };
    // Realizamos la actualización
    const updatedProducts = [...inventory.products];
    updatedProducts[index] = updatedProduct;

    // Actualizamos el inventario
    await db.inventory.update(1, { products: updatedProducts });

    return 'Producto en inventario actualizado exitosamente.';
  } catch (error) {
    //@ts-expect-error
    return { success: false, message: error.message };
  }
}
// Exporta el objeto inventorydb para su uso en otros módulos
export default inventory;
export type InventoryMethods = typeof inventory;
//const inventory = await db.inventory.get(1).then( inv => inv?.products)
