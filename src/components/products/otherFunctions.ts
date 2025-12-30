import Dexie from 'dexie';
import inventory from '../../models/inventorydb';

// Inicialización de la base de datos
const db = new Dexie('ProductTable');
db.version(1).stores({
  products: `++id,name,unit,price,sold_products,initial_products,incoming_products,final_products,created_at,updated_at`,
  inventoriesRecord: `++id,date,products`,
});

/* Función que borra todos los productos y luego los añade de nuevo
export const refreshProducts = async () => {
  // Borra todos los registros actuales
  await product.deleteAll();

  // Añade los nuevos registros
  await product.addMany(productsData);

  return productsData; // Retorna los datos que se acaban de añadir si se necesita
};*/

export async function getInventoriesRecord() {
  try {
    const records = await inventory.getAll();
    return records;
  } catch (error) {
    console.error('Error retrieving inventories record:', error);
    return [];
  }
}
