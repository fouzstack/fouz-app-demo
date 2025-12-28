import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type CounterStore = {
  count: number;
  reset: () => void;
  increase: () => void;
  decrease: () => void;
};

export const useCounterStore = create<CounterStore>()(
  persist(
    (set, get) => ({
      count: 0,
      reset: () => set({ count: 0 }),
      increase: () => set({ count: get().count + 1 }),
      decrease: () => set({ count: get().count - 1 }),
    }),
    {
      name: 'counter', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

type ICounter = {
  state: { count: number };
};
export const getPersistedCounter = () => {
  //const state = useCounterStore.persist.getOptions().storage.getItem('counter') )
  const json =
    localStorage.getItem('counter') ||
    JSON.stringify({ state: { count: 0 }, version: 0 });
  const counter: ICounter = JSON.parse(json);
  const { state } = counter;
  const count = state.count;
  return count;
};

/*
import {useCounterStore} from './counterStore'

How to update or consume the state.
function Counter() {
  const count = useCounterStore((state) => state.count)
  return <h1>{count} around here...</h1>
}

function Controls() {
  const increase = useCounterStore((state) => state.increase);
  const decrease = useCounterStore((state) => state.decrease);
  return <button onClick={increasePopulation}>one up</button>
}

*/
