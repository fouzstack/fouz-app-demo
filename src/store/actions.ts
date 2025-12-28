export interface GlobalProduct {
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
  available_products?: number;
  final_products?: number | null;
  total_cash?: number;
  created_at: Date | string | number;
  updated_at: Date | string | number;
}

export const initialState: GlobalProduct = {
  id: undefined,
  code: '',
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
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export type Action = {
  type: string;
  payload: GlobalProduct;
};
export interface ProductStore {
  product: GlobalProduct;
  dispatch: (action: Action) => void;
}

interface Actions {
  [x: string]: (
    state: ProductStore,
    action: Action,
  ) => {
    product: GlobalProduct;
    dispatch: (action: Action) => void;
  };
}
export interface ActionTypes {
  SET_PRODUCT: string;
}
export const ACTION_TYPES: ActionTypes = {
  SET_PRODUCT: 'SET_PRODUCT',
};
export const actions: Actions = {
  [ACTION_TYPES.SET_PRODUCT]: (state: ProductStore, action: Action) => {
    const product = { ...action.payload };
    const newState = {
      ...state,
      product,
    };
    return newState;
  },
};
