import apiClient from '../client';

export interface Escola {
  id: number;
  nome_escola: string;
  cnpj: string;
  telefone: string;
  email: string;
  website: string;
  logo: string | null;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
  complemento: string;
  sobre: string;
  niveis_ensino: Record<string, any>;
  token_mensagens: string;
  criado_em: string;
  atualizado_em: string;
}

export const escolaService = {
  async get(id: number): Promise<Escola> {
    const response = await apiClient.get<Escola>(`/escolas/${id}/`);
    return response.data;
  },

  async update(id: number, data: Partial<Escola>): Promise<Escola> {
    const response = await apiClient.patch<Escola>(`/escolas/${id}/`, data);
    return response.data;
  },

  async getUsuarios(id: number) {
    const response = await apiClient.get(`/escolas/${id}/usuarios/`);
    return response.data;
  },
};