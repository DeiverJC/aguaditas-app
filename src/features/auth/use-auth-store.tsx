import type { TokenType, UserType } from '@/lib/auth/utils';

import { create } from 'zustand';
import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  setToken,
  setUser,
} from '@/lib/auth/utils';
import { createSelectors } from '@/lib/utils';

type AuthState = {
  token: TokenType | null;
  user: UserType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (token: TokenType, user: UserType) => void;
  signOut: () => void;
  hydrate: () => void;
};

const _useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  user: null,
  signIn: (token, user) => {
    setToken(token);
    setUser(user);
    set({ status: 'signIn', token, user });
  },
  signOut: () => {
    removeToken();
    removeUser();
    set({ status: 'signOut', token: null, user: null });
  },
  hydrate: () => {
    try {
      const userToken = getToken();
      const userData = getUser();
      if (userToken !== null && userData !== null) {
        get().signIn(userToken, userData);
      }
      else {
        get().signOut();
      }
    }
    catch (e) {
      console.error(e);
    }
  },
}));

export const useAuthStore = createSelectors(_useAuthStore);

export const signOut = () => _useAuthStore.getState().signOut();
export function signIn(token: TokenType, user: UserType) {
  return _useAuthStore.getState().signIn(token, user);
}
export const hydrateAuth = () => _useAuthStore.getState().hydrate();
