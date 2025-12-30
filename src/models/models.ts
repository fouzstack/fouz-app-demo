import Dexie, { type EntityTable } from 'dexie';
import { InventoryMethods } from './inventorydb';

export interface ProductType {
  id?: number; // Optional since this will be auto-incremented
  code: string;
  name: string;
  unit: string;
  cost: number;
  price: number; // Se representa como número, puede ser convertido a Decimal si es necesario
  initial_products: number;
  incoming_products: number;
  losses: number;
  final_products: number | null;
  created_at: string | number | Date;
  updated_at: string | number | Date;
}

export interface InventoryType {
  id: number;
  seller: string;
  time: string;
  date: string | number | Date; // Fecha del inventario
  products: ProductType[]; // Lista de productos en el inventario
  created_at?: string | number | Date; // Fecha de creación
  updated_at?: string | number | Date; // Fecha de actualización
}

export interface RecordsType {
  id: number;
  seller: string;
  time: string;
  date: string | number | Date;
  products: ProductType[];
}

const db = new Dexie('ProductTable') as Dexie & {
  products: EntityTable<ProductType, 'id'>;
  inventory: EntityTable<InventoryType, 'id'>;
  records: EntityTable<RecordsType, 'id'>;
};

db.version(1).stores({
  products: `++id,code,name,unit,cost,price,initial_products,incoming_products, losses,final_products,created_at,updated_at`,
  inventory: `id,seller,time,date,products`,
  records: `++id,seller,time,date,products`,
});

export const initialProduct: ProductType = {
  id: undefined,
  code: ' -- ',
  name: '',
  unit: '',
  cost: 0.0,
  price: 0.0,
  initial_products: 0,
  incoming_products: 0,
  losses: 0,
  final_products: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function normalizeProduct(
  product: Partial<ProductType>,
): Omit<ProductType, 'id'> {
  return {
    code: product.code || ' -- ',
    name: product.name || 'Nombre',
    unit: product.unit || 'unidad',
    cost: product.cost || 0,
    price: product.price || 0, // Inicializa a 0 si no se proporciona
    initial_products: product.initial_products || 0, // Inicializa a 0
    incoming_products: product.incoming_products || 0, // Inicializa a 0
    losses: product.losses || 0, // Inicializa a 0
    final_products: product.final_products || null, // Puede ser null si no se proporciona
    created_at: new Date().toISOString(), // Fecha actual
    updated_at: new Date().toISOString(), // Fecha actual
  };
}
export { db };
export type { InventoryMethods };
