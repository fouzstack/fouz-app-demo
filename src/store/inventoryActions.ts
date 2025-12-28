import { formatDateAndTime } from '../models/utils';

const today = new Date();

export interface ReplaceProductInterface {
  id: number;
  code: string;
  name: string;
  unit: string;
  cost: number;
  price: number;
  initial_products: number;
  incoming_products: number;
  losses: number;
  final_products: number | null;
  created_at: Date | string | number;
  updated_at: Date | string | number;
}

export interface InterfaceProduct {
  salesPercentage?: number;
  id?: number;
  code: string;
  name: string;
  unit: string;
  cost: number;
  price: number;
  initial_products: number;
  incoming_products: number;
  losses: number;
  quantity?: number;
  sold_products?: number;
  available_products?: number;
  final_products?: number | null;
  total_cash?: number;
  created_at: Date | string | number;
  updated_at: Date | string | number;
}

export const initialProduct: InterfaceProduct = {
  id: -123,
  code: ' -- ',
  name: '',
  unit: '',
  cost: 0.0,
  price: 0.0,
  initial_products: 0,
  incoming_products: 0,
  losses: 0,
  quantity: 0,
  available_products: 0,
  final_products: 0,
  total_cash: 0,
  created_at: new Date(),
  updated_at: new Date(),
};

export interface GlobalInventory {
  id: number;
  seller: string;
  time: string;
  date: Date | string | number;
  products: InterfaceProduct[];
}

export const initialInventory = {
  id: 0,
  seller: 'Administrador',
  time: formatDateAndTime(today).time,
  date: new Date(),
  products: [initialProduct],
};
export type Action = {
  type: string;
  payload: GlobalInventory;
};
export interface InventoryStore {
  inventory: GlobalInventory;
  dispatch: (action: Action) => void;
}

interface Actions {
  [x: string]: (
    state: InventoryStore,
    action: Action,
  ) => {
    inventory: GlobalInventory;
    dispatch: (action: Action) => void;
  };
}
export interface ActionTypes {
  SET_INVENTORY: string;
  SET_SELLER: string; // <-- nuevo
  UPDATE_PRODUCT: string; // <-- nuevo
}
export const ACTION_TYPES: ActionTypes = {
  SET_INVENTORY: 'SET_INVENTORY',
  SET_SELLER: 'SET_SELLER', // <-- nuevo
  UPDATE_PRODUCT: 'UPDATE_PRODUCT', // <-- nuevo
};
export const actions: Actions = {
  [ACTION_TYPES.SET_INVENTORY]: (state: InventoryStore, action: Action) => {
    const inventory = { ...action.payload };
    const newState = {
      ...state,
      inventory,
    };
    return newState;
  },
  [ACTION_TYPES.SET_SELLER]: (state: InventoryStore, action: Action) => {
    // Solo actualiza seller, mantiene el resto igual
    const newInventory = {
      ...state.inventory,
      seller: action.payload.seller,
    };
    return {
      ...state,
      inventory: newInventory,
    };
  },
  [ACTION_TYPES.UPDATE_PRODUCT]: (state: InventoryStore, action: Action) => {
    const updatedProduct: InterfaceProduct =
      action.payload as unknown as InterfaceProduct;
    // Mapea el arreglo actual de productos,
    // reemplazando el producto que coincide por id con el producto actualizado
    const updatedProducts = state.inventory.products.map((product) =>
      product.id === updatedProduct.id
        ? { ...product, ...updatedProduct }
        : product,
    );

    // Construimos nuevo inventario con productos actualizados
    const updatedInventory: GlobalInventory = {
      ...state.inventory,
      products: updatedProducts,
    };

    return {
      ...state,
      inventory: updatedInventory,
    };
  },
};
