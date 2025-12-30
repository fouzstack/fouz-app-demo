import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { actions, Action, ProductStore, initialState } from './actions.ts';

const reducer = (state: ProductStore, action: Action) => {
  const { type } = action;
  const currentAction = actions[type];
  return currentAction ? currentAction(state, action) : state;
};

//Redux-like patterns store
const productState = persist<ProductStore>(
  (set) => ({
    product: initialState,
    dispatch: (action: Action) => set((state) => reducer(state, action)),
  }),
  {
    name: 'product', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  },
);
export const useProductStore = create(productState);

/*example of how to consume the store

import {useProductStore} from './store'
const product = useProductStore( state => state.product ) // THIS GET THE FULL PRODUCT.
const dispatch = useProductStore((state) => state.dispatch)
dispatch({type:'SET_PRODUCT', payload: product}) 
*/
