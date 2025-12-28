import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserStore, UserAction, useractions } from './userActions';

const reducer = (state: UserStore, action: UserAction) => {
  const { type } = action;
  const currentAction = useractions[type];
  return currentAction ? currentAction(state, action) : state;
};

export const initialState = {
  isAuth: false,
  isVerified: false,
  username: undefined,
  password: undefined,
};
//Redux-like patterns store
const userState = persist<UserStore>(
  (set) => ({
    user: initialState,
    dispatch: (action: UserAction) => set((state) => reducer(state, action)),
  }),
  {
    name: 'user', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  },
);
export const useUserStore = create(userState);

/*example of how to consume the store

import {useUserStore} from './userStore'
const user = useUserStore( state => state.user ) 
const dispatch =useUserStore((state) => state.dispatch)
dispatch({type:'SET_USER', payload: user}) 
*/
