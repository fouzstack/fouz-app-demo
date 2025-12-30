import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  actions,
  Action,
  InventoryStore,
  initialInventory,
} from './inventoryActions.ts';

const reducer = (state: InventoryStore, action: Action) => {
  const { type } = action;
  const currentAction = actions[type];
  return currentAction ? currentAction(state, action) : state;
};

//Redux-like patterns store
const inventoryState = persist<InventoryStore>(
  (set) => ({
    inventory: initialInventory,
    dispatch: (action: Action) => set((state) => reducer(state, action)),
  }),
  {
    name: 'product', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  },
);
export const useInventoryStore = create(inventoryState);

/* Example of how to consume the store

import {useInventoryStore} from '../inventoryStore'
const inventory = useInventoryStore( state => state.inventory ) // THIS GET THE FULL INVENTORY.
const dispatch = useInventoryStore((state) => state.dispatch)
dispatch({type:'SET_INVENTORY', payload: inventory}) 
*/
