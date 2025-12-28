import { db } from './models';
import { InventoryType /*RecordsType*/ } from './models';
import { formatDateAndTime, formatDateToDMY } from './utils';

export async function setupNextInventory(seller: string) {
  try {
    const newDate = new Date();
    const existingInventory = await db.inventory.get(1);
    if (!existingInventory) {
      return 'No existe un inventario para actualizar.';
    }
    //si existe creo su registro o copia y se añade un nuevo registro.
    const currentInventory: InventoryType = existingInventory;
    await db.records.add({
      seller: seller,
      time: formatDateAndTime().time,
      date: formatDateToDMY(newDate),
      products: currentInventory.products.map((product) => ({ ...product })),
    });

    // Filtrar productos que tengan final_products > 0

    const filteredProducts = currentInventory.products.filter(
      //@ts-expect-error
      (product) => product.final_products > 0 || product.final_products == null,
    );
    //const newDate = new Date();
    let hours = newDate.getHours();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convierte 0 a 12 para formato en 12 horas
    const minutes = String(newDate.getMinutes()).padStart(2, '0');
    const time = `${String(hours).padStart(2, '0')}:${minutes} ${amPm}`;

    const updatedInventory = {
      id: currentInventory.id,
      seller: seller,
      time: time,
      date: newDate,
      products: filteredProducts.map((product) => ({
        ...product,
        initial_products:
          product.final_products == null
            ? product.incoming_products +
              (product.initial_products || 0) -
              product.losses
            : product.final_products,
        incoming_products: 0,
        losses: 0,
        final_products: null,
        updated_at: new Date(),
      })),
    };

    await db.inventory.update(updatedInventory.id, updatedInventory);
    /* } else {
      return 'La fecha ya existe en records.';
    } */

    return 'Inventario actualizado con éxito.';
  } catch (error) {
    console.error('Error actualizando el inventario:', error);
    return 'Ocurrió un error al actualizar el inventario.';
  }
}
