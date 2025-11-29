import apiClient from '../client';

export interface Contato {
  id: number;
  escola: number;
  escola_nome: string;
  nome: string;
  email: string;
  telefone: string;
  data_nascimento: string | null;
  status: 'ativo' | 'inativo';
  status_display: string;
  origem: string;
  origem_display: string;
  ultima_interacao: string | null;
  observacoes: string;
  tags: string;
  criado_em: string;
  atualizado_em: string;
}

export interface ContatoCreate {
  nome: string;
  email?: string;
  telefone: string;
  data_nascimento?: string;
  origem: string;
  status?: string;
  observacoes?: string;
  tags?: string;
}

export const contatoService = {
  async list(params?: { status?: string; origem?: string; search?: string }): Promise<Contato[]> {
    const response = await apiClient.get<Contato[]>('/contatos/', { params });
    return response.data;
  },

  async get(id: number): Promise<Contato> {
    const response = await apiClient.get<Contato>(`/contatos/${id}/`);
    return response.data;
  },

  async create(data: ContatoCreate): Promise<Contato> {
    const response = await apiClient.post<Contato>('/contatos/', data);
    return response.data;
  },

  async update(id: number, data: Partial<ContatoCreate>): Promise<Contato> {
    const response = await apiClient.patch<Contato>(`/contatos/${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/contatos/${id}/`);
  },

  async registrarInteracao(id: number): Promise<Contato> {
    const response = await apiClient.post<Contato>(`/contatos/${id}/registrar_interacao/`);
    return response.data;
  },

  async getStats() {
    const response = await apiClient.get('/contatos/estatisticas/');
    return response.data;
  },
};