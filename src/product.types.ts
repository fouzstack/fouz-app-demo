import { Table } from 'dexie';

export interface Product {
  id?: number; // Optional since this will be auto-incremented
  name: string;
  unit: string;
  price: number; // Se representa como número, puede ser convertido a Decimal si es necesario
  initial_products: number;
  incoming_products: number;
  losses: number;
  final_products: number | null;
  isFavorite: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Inventory {
  date: string | Date; // Fecha del inventario
  products: Product[]; // Lista de productos en el inventario
  created_at?: Date; // Fecha de creación
  updated_at?: Date; // Fecha de actualización
}

export interface InventoryRecord {
  date: string | number | Date;
  products: Product[];
}

// Define la estructura de la base de datos
export interface ProductInventoryDataBase {
  products: Table<Product>; // Define la tabla `products`
  inventoriesRecord: Table<InventoryRecord>; // Define la tabla `inventoriesRecord`
}

export interface ProductMethProps {
  InternationalDateFormater: (date: string | number | Date) => string;
  save: (product: any) => Promise<any>;
  add: (_product: Product) => Promise<string>;
  addMany: (productsFromJson: Product[]) => Promise<Product[]>;
}
