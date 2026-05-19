import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface AuthStore {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: async (username, password) => {
        try {
          const response = await api.post('/auth/login', { username, password });
          if (response.data.success) {
            set({ 
              isAuthenticated: true, 
              token: response.data.token,
              user: response.data.user
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      logout: () => {
        set({ isAuthenticated: false, token: null, user: null });
      },
    }),
    {
      name: 'uzafo_auth',
    }
  )
);

