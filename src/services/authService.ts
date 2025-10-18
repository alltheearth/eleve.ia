// authService.ts - Serviço de autenticação
import axios, {type AxiosInstance, AxiosError } from 'axios';

interface LoginCredentials {
  email: string;
  senha: string;
}

interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    nome: string;
    email: string;
  };
}

interface ApiError {
  message: string;
  status: number;
}

class AuthService {
  private api: AxiosInstance;
  private readonly TOKEN_KEY = 'batata22_token';
  private readonly REFRESH_TOKEN_KEY = 'batata22_refresh_token';
  private readonly API_URL = 'http://localhost:8000/api';

  constructor() {
    this.api = axios.create({
      baseURL: this.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token em todas as requisições
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para tratar respostas com erro 401
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshAccessToken(refreshToken);
              this.setToken(response.token);
              
              // Repetir a requisição original
              originalRequest.headers.Authorization = `Bearer ${response.token}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      const { token, refreshToken } = response.data;
      
      this.setToken(token);
      if (refreshToken) {
        this.setRefreshToken(refreshToken);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Registrar
  async register(userData: {
    nomeCompleto: string;
    nomeEscola: string;
    email: string;
    senha: string;
  }): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', userData);
      const { token, refreshToken } = response.data;
      
      this.setToken(token);
      if (refreshToken) {
        this.setRefreshToken(refreshToken);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Renovar token
  private async refreshAccessToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const response = await this.api.post<{ token: string }>('/auth/refresh', {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Fazer logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // Getters
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Setters privados
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  // Tratamento de erros
  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'Erro desconhecido';
      const status = error.response?.status || 500;
      return { message, status };
    }
    return { message: 'Erro desconhecido', status: 500 };
  }
}

export const authService = new AuthService();
export type { AuthResponse, LoginCredentials, ApiError };


