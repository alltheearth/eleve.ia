import apiClient from '../client';

export interface Evento {
  id: number;
  escola: number;
  escola_nome: string;
  data: string;
  evento: string;
  tipo: 'feriado' | 'prova' | 'formatura' | 'evento_cultural';
  criado_em: string;
  atualizado_em: string;
}

export interface EventoCreate {
  data: string;
  evento: string;
  tipo: string;
}

export const eventoService = {
  async list(): Promise<Evento[]> {
    const response = await apiClient.get<Evento[]>('/eventos/');
    return response.data;
  },

  async get(id: number): Promise<Evento> {
    const response = await apiClient.get<Evento>(`/eventos/${id}/`);
    return response.data;
  },

  async create(data: EventoCreate): Promise<Evento> {
    const response = await apiClient.post<Evento>('/eventos/', data);
    return response.data;
  },

  async update(id: number, data: Partial<EventoCreate>): Promise<Evento> {
    const response = await apiClient.patch<Evento>(`/eventos/${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/eventos/${id}/`);
  },

  async getProximos(): Promise<Evento[]> {
    const response = await apiClient.get<Evento[]>('/eventos/proximos_eventos/');
    return response.data;
  },
};
