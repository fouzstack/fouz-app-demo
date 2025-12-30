import { db, InventoryType, ProductType } from './models';
import { formatDateAndTime } from './utils';

const normalizeProduct = (product: ProductType): ProductType => ({
  id: product.id,
  code: product.code || ' --- ',
  name: product.name,
  unit: product.unit,
  cost: product.cost,
  price: product.price,
  initial_products: product.initial_products,
  incoming_products: 0,
  losses: 0,
  final_products: null,
  created_at: new Date(),
  updated_at: new Date(),
});

export const createOrUpdateInventory = async (
  product: Partial<ProductType>,
): Promise<string> => {
  // Validar que incoming_products sea mayor que cero
  if (!product.initial_products || product.initial_products <= 0) {
    throw new Error('La cantidad debe ser mayor que cero!');
  }
  // Normalizar el producto
  const normalizedProduct = normalizeProduct(product as ProductType);
  // Intentar obtener el inventario con ID 1
  const existingInventory = await db.inventory.get(1);
  const date = new Date();
  if (existingInventory) {
    // Si el inventario existe, actualizar la lista de productos
    existingInventory.products.push(normalizedProduct);

    // Actualizar el inventario en la base de datos
    await db.inventory.update(1, { products: existingInventory.products });

    return 'Inventario actualizado exitosamente';
  } else {
    // Si el inventario no existe, crear uno nuevo
    const newInventory: InventoryType = {
      id: 1, // ID fijo para el inventario
      time: formatDateAndTime(date).time,
      seller: 'Administrador',
      date: date, // O la fecha que necesites
      products: [normalizedProduct], // Agregar el producto normalizado
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insertar nuevo inventario en la base de datos
    await db.inventory.add(newInventory);
    return 'Inventario creado exitosamente';
  }
};
