//---------------UserStore------------------------------------

export interface UserActionInterface {
  SET_USER: string;
  LOG_OUT: string;
  VERIFY: string;
}
export const USER_ACTION_TYPES: UserActionInterface = {
  SET_USER: 'SET_USER',
  LOG_OUT: 'LOG_OUT',
  VERIFY: 'VERIFY',
};

export interface User {
  isAuth: boolean;
  isVerified: boolean;
  username: string | undefined;
  password: string | undefined;
}

export type UserAction = {
  type: 'SET_USER' | 'LOG_OUT' | 'VERIFY' | string;
  payload: User;
};
export interface UserStore {
  user: User;
  dispatch: (action: UserAction) => void;
}

interface UserActions {
  [x: string]: (
    state: UserStore,
    action: UserAction,
  ) => {
    user: User;
    dispatch: (action: UserAction) => void;
  };
}

export const useractions: UserActions = {
  [USER_ACTION_TYPES.SET_USER]: (state: UserStore, action: UserAction) => {
    const user = { ...action.payload };
    const newState = {
      ...state,
      user,
    };
    return newState;
  },
  [USER_ACTION_TYPES.LOG_OUT]: (state: UserStore, action: UserAction) => {
    const user = { ...action.payload };
    const newState = {
      ...state,
      user,
    };
    return newState;
  },
  [USER_ACTION_TYPES.VERIFY]: (state: UserStore, action: UserAction) => {
    const user = { ...action.payload };
    const newState = {
      ...state,
      user,
    };
    return newState;
  },
};
