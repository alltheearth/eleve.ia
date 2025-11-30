// src/services/authService.ts - COM DEBUG DETALHADO

import axios, { type AxiosInstance} from 'axios';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  message: string;
}

interface ApiError {
  message: string;
  status: number;
  details?: any;
}

class AuthService {
  private api: AxiosInstance;
  private readonly TOKEN_KEY = 'eleve_token';
  private readonly API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  constructor() {
    this.api = axios.create({
      baseURL: this.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Token ${token}`;
        }
        console.log('📤 Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
          data: config.data,
        });
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para respostas
    this.api.interceptors.response.use(
      (response) => {
        console.log('📥 Response Success:', {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Iniciando login com:', { username: credentials.username });

      // Validar dados localmente
      if (!credentials.username || !credentials.password) {
        throw new Error('Username e password são obrigatórios');
      }

      const loginData = {
        username: credentials.username,
        password: credentials.password,
      };

      console.log('📨 Enviando para /auth/login/:', loginData);

      const response = await this.api.post<AuthResponse>('/auth/login/', loginData);

      console.log('✅ Login successful:', response.data);

      const { token } = response.data;
      this.setToken(token);

      return response.data;
    } catch (error) {
      console.error('🚨 Login failed:', error);
      throw this.handleError(error);
    }
  }

  async register(userData: RegisterCredentials): Promise<AuthResponse> {
    try {
      console.log('📝 Iniciando registro com:', userData);

      // Validar dados
      if (
        !userData.username ||
        !userData.email ||
        !userData.password ||
        !userData.password2
      ) {
        throw new Error(
          'Username, email, password e password2 são obrigatórios'
        );
      }

      if (userData.password !== userData.password2) {
        throw new Error('As senhas não coincidem');
      }

      const registerData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password2: userData.password2,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
      };

      console.log('📨 Enviando para /auth/registro/:', registerData);

      const response = await this.api.post<AuthResponse>(
        '/auth/registro/',
        registerData
      );

      console.log('✅ Register successful:', response.data);

      const { token } = response.data;
      this.setToken(token);

      return response.data;
    } catch (error) {
      console.error('🚨 Register failed:', error);
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('🚪 Iniciando logout');
      await this.api.post('/auth/logout/');
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('⚠️ Erro ao fazer logout:', error);
    } finally {
      this.removeToken();
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const auth = !!this.getToken();
    console.log('🔍 isAuthenticated:', auth);
    return auth;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('💾 Token salvo:', token.substring(0, 20) + '...');
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    console.log('🗑️ Token removido');
  }

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const data = error.response?.data;

      let message = 'Erro desconhecido';

      // Tentar extrair mensagem de diferentes formatos
      if (typeof data === 'string') {
        message = data;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.detail) {
        message = data.detail;
      } else if (data?.error) {
        message = data.error;
      } else if (data?.non_field_errors?.[0]) {
        message = data.non_field_errors[0];
      } else if (typeof data === 'object') {
        // Tentar extrair primeira mensagem de erro do objeto
        const firstKey = Object.keys(data)[0];
        if (Array.isArray(data[firstKey])) {
          message = data[firstKey][0];
        } else if (typeof data[firstKey] === 'string') {
          message = data[firstKey];
        }
      }

      console.error('🔴 API Error:', {
        status,
        message,
        fullData: data,
      });

      return {
        message,
        status,
        details: data,
      };
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('🔴 Unknown Error:', errorMessage);

    return {
      message: errorMessage,
      status: 500,
    };
  }
}

export const authService = new AuthService();
export type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ApiError,
};