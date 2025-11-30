import apiClient, { setAuthToken, removeAuthToken, setStoredUser } from '../client';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  escola_id: number;
  tipo_perfil: 'gestor' | 'operador';
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_staff: boolean;
  perfil?: {
    id: number;
    escola: number;
    escola_nome: string;
    tipo: string;
    tipo_display: string;
    ativo: boolean;
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

const authService = {
  /**
   * Login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login/', credentials);
    
    // Salvar token e usuário
    setAuthToken(response.data.token);
    setStoredUser(response.data.user);
    
    return response.data;
  },

  /**
   * Registro de novo usuário
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/registro/', data);
    
    // Salvar token e usuário
    setAuthToken(response.data.token);
    setStoredUser(response.data.user);
    
    return response.data;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout/');
    } finally {
      removeAuthToken();
    }
  },

  /**
   * Obter perfil do usuário
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/perfil/');
    return response.data;
  },

  /**
   * Atualizar perfil
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/auth/atualizar-perfil/', data);
    setStoredUser(response.data);
    return response.data;
  },
};

export default authService;
