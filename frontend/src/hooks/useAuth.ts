import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { isAuthenticated, login, logout } = useAuthStore();
  return { isAuthenticated, login, logout };
}
