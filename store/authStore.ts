import {create} from 'zustand';

type User = {
  id: string;
  name: string;
  email: string;
  token: string;
  avatar: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type AuthStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  setUser: user => set({user}),
  logout: () => set({user: null}),
}));
