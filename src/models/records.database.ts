import { acyncFunctionHandler } from './acyncFunctionHandler';
import { db, ProductType, RecordsType } from './models';

// Funciones para el modelo InventoryRecord
export const createRecords = (date: Date, products: ProductType) => ({
  date: new Date(date),
  products: products || [],
});

// Funciones de acceso a la base de datos para InventoriesRecord
export const recordsdb = {
  save: async (record: RecordsType) => {
    return await acyncFunctionHandler(() => db.records.add(record));
  },

  delete: async (id: number) => {
    return await acyncFunctionHandler(() => db.records.delete(id));
  },
  deleteAll: async () => {
    return await acyncFunctionHandler(() => db.records.clear());
  },

  getById: async (id: number) => {
    return await acyncFunctionHandler(() => db.records.get(id));
  },

  getAll: async () => {
    return await acyncFunctionHandler(() => db.records.toArray());
  },

  existingRecord: async (currentDate: Date | string) => {
    return await acyncFunctionHandler(() =>
      db.records.where('date').equals(currentDate).first(),
    );
  },
};
