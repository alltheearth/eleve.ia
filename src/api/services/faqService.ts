import apiClient from '../client';

export interface FAQ {
  id: number;
  escola: number;
  escola_nome: string;
  pergunta: string;
  resposta: string;
  categoria: string;
  status: 'ativa' | 'inativa';
  criado_em: string;
  atualizado_em: string;
}

export interface FAQCreate {
  pergunta: string;
  resposta: string;
  categoria: string;
  status?: string;
}

export const faqService = {
  async list(params?: { status?: string }): Promise<FAQ[]> {
    const response = await apiClient.get<FAQ[]>('/faqs/', { params });
    return response.data;
  },

  async get(id: number): Promise<FAQ> {
    const response = await apiClient.get<FAQ>(`/faqs/${id}/`);
    return response.data;
  },

  async create(data: FAQCreate): Promise<FAQ> {
    const response = await apiClient.post<FAQ>('/faqs/', data);
    return response.data;
  },

  async update(id: number, data: Partial<FAQCreate>): Promise<FAQ> {
    const response = await apiClient.patch<FAQ>(`/faqs/${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/faqs/${id}/`);
  },
};

