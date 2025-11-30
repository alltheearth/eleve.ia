// src/services/leadsApi.ts - RTK Query para gerenciar Leads
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface Lead {
  id: number;
  usuario_id: number;
  escola: number;
  escola_nome: string;
  nome: string;
  email: string;
  telefone: string;
  status: 'novo' | 'contato' | 'qualificado' | 'conversao' | 'perdido';
  status_display: string;
  origem: string;
  origem_display: string;
  observacoes?: string;
  interesses?: Record<string, any>;
  contatado_em?: string | null;
  convertido_em?: string | null;
  criado_em: string;
  atualizado_em: string;
}

interface LeadsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Lead[];
}

interface LeadStats {
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

interface LeadFilters {
  escola_id?: string;
  status?: string;
  origem?: string;
  search?: string;
}

interface ExportCSVParams {
  escola_id?: string;
}

export const leadsApi = createApi({
  reducerPath: 'leadsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('eleve_token');
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Lead', 'LeadStats'],
  endpoints: (builder) => ({
    // ✅ CORRETO - Buscar todos os leads do usuário
    getLeads: builder.query<LeadsResponse, LeadFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        // ✅ CORRETO - Verificar se filters existe antes de acessar propriedades
        if (filters && filters.escola_id) {
          params.append('escola_id', filters.escola_id);
        }
        if (filters && filters.status && filters.status !== 'todos') {
          params.append('status', filters.status);
        }
        if (filters && filters.origem) {
          params.append('origem', filters.origem);
        }
        if (filters && filters.search) {
          params.append('search', filters.search);
        }
        
        const queryString = params.toString();
        return queryString ? `/leads/?${queryString}` : '/leads/';
      },
      providesTags: ['Lead'],
    }),

    // ✅ CORRETO - Buscar lead por ID
    getLeadById: builder.query<Lead, number>({
      query: (id) => `/leads/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Lead', id }],
    }),

    // ✅ CORRETO - Criar novo lead
    createLead: builder.mutation<Lead, Partial<Lead>>({
      query: (leadData) => ({
        url: '/leads/',
        method: 'POST',
        body: leadData,
      }),
      invalidatesTags: ['Lead', 'LeadStats'],
    }),

    // ✅ CORRETO - Atualizar lead
    updateLead: builder.mutation<Lead, { id: number; data: Partial<Lead> }>({
      query: ({ id, data }) => ({
        url: `/leads/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Lead', id },
        'Lead',
        'LeadStats',
      ],
    }),

    // ✅ CORRETO - Deletar lead
    deleteLead: builder.mutation<void, number>({
      query: (id) => ({
        url: `/leads/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lead', 'LeadStats'],
    }),

    // ✅ CORRETO - Mudar status do lead
    mudarStatus: builder.mutation<Lead, { id: number; status: Lead['status'] }>({
      query: ({ id, status }) => ({
        url: `/leads/${id}/mudar_status/`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Lead', id },
        'Lead',
        'LeadStats',
      ],
    }),

    // ✅ CORRETO - Obter estatísticas
    getEstatisticas: builder.query<LeadStats, string | void>({
      query: (escola_id) => {
        const params = escola_id ? `?escola_id=${escola_id}` : '';
        return `/leads/estatisticas/${params}`;
      },
      providesTags: ['LeadStats'],
    }),

    // ✅ CORRETO - Buscar leads recentes
    getLeadsRecentes: builder.query<Lead[], { escola_id?: string; limit?: number }>({
      query: ({ escola_id, limit = 10 }) => {
        const params = new URLSearchParams();
        if (escola_id) params.append('escola_id', escola_id);
        params.append('limit', limit.toString());
        return `/leads/recentes/?${params.toString()}`;
      },
      providesTags: ['Lead'],
    }),

    // ✅ CORRETO - Exportar para CSV
    exportarCSV: builder.mutation<Blob, ExportCSVParams>({
      query: ({ escola_id }) => ({
        url: '/leads/exportar_csv/',
        method: 'POST',
        body: { escola_id },
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error('Erro ao exportar CSV');
          }
          return response.blob();
        },
      }),
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useMudarStatusMutation,
  useGetEstatisticasQuery,
  useGetLeadsRecentesQuery,
  useExportarCSVMutation,
} = leadsApi;

export type { Lead, LeadsResponse, LeadStats, LeadFilters, ExportCSVParams };