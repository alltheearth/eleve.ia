import apiClient from '../client';

export interface Lead {
  id: number;
  escola: number;
  escola_nome: string;
  nome: string;
  email: string;
  telefone: string;
  status: 'novo' | 'contato' | 'qualificado' | 'conversao' | 'perdido';
  status_display: string;
  origem: 'site' | 'whatsapp' | 'indicacao' | 'ligacao' | 'email' | 'facebook' | 'instagram';
  origem_display: string;
  observacoes: string;
  interesses: Record<string, any>;
  contatado_em: string | null;
  convertido_em: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface LeadCreate {
  nome: string;
  email: string;
  telefone: string;
  origem: string;
  status?: string;
  observacoes?: string;
  interesses?: Record<string, any>;
}

export interface LeadStats {
  total: number;
  novo: number;
  contato: number;
  qualificado: number;
  conversao: number;
  perdido: number;
  por_origem: Record<string, number>;
  novos_hoje: number;
  taxa_conversao: number;
}

export const leadService = {
  /**
   * Listar leads
   */
  async list(params?: {
    status?: string;
    origem?: string;
    search?: string;
  }): Promise<Lead[]> {
    const response = await apiClient.get<Lead[]>('/leads/', { params });
    return response.data;
  },

  /**
   * Obter lead por ID
   */
  async get(id: number): Promise<Lead> {
    const response = await apiClient.get<Lead>(`/leads/${id}/`);
    return response.data;
  },

  /**
   * Criar lead
   */
  async create(data: LeadCreate): Promise<Lead> {
    const response = await apiClient.post<Lead>('/leads/', data);
    return response.data;
  },

  /**
   * Atualizar lead
   */
  async update(id: number, data: Partial<LeadCreate>): Promise<Lead> {
    const response = await apiClient.patch<Lead>(`/leads/${id}/`, data);
    return response.data;
  },

  /**
   * Deletar lead
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/leads/${id}/`);
  },

  /**
   * Mudar status do lead
   */
  async changeStatus(id: number, status: string): Promise<Lead> {
    const response = await apiClient.post<Lead>(`/leads/${id}/mudar_status/`, { status });
    return response.data;
  },

  /**
   * Obter estatísticas
   */
  async getStats(): Promise<LeadStats> {
    const response = await apiClient.get<LeadStats>('/leads/estatisticas/');
    return response.data;
  },

  /**
   * Leads recentes
   */
  async getRecent(limit: number = 10): Promise<Lead[]> {
    const response = await apiClient.get<Lead[]>('/leads/recentes/', {
      params: { limit }
    });
    return response.data;
  },
};
