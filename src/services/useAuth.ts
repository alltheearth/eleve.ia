// useAuth.ts - Hook customizado
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { authService, type LoginCredentials, type AuthResponse } from './authService';

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: any) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch();

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      // Salvar user no Redux se necessário
      dispatch({ type: 'SET_USER', payload: response.user });
      return response;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }, [dispatch]);

  const register = useCallback(async (userData: any) => {
    try {
      const response = await authService.register(userData);
      dispatch({ type: 'SET_USER', payload: response.user });
      return response;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: 'CLEAR_USER' });
  }, [dispatch]);

  return {
    login,
    register,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  };
};

