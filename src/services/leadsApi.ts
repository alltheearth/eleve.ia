// src/services/leadsApi.ts - RTK Query para gerenciar Leads
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'http://localhost:8000/api';

// ✅ CORRETO - Interface Lead
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

// ✅ CORRETO - Adicionar interface para o payload do CSV
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
    // Buscar todos os leads do usuário
    getLeads: builder.query<LeadsResponse, LeadFilters | void>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        
        if (filters.escola_id) params.append('escola_id', filters.escola_id);
        if (filters.status && filters.status !== 'todos') {
          params.append('status', filters.status);
        }
        if (filters.origem) params.append('origem', filters.origem);
        if (filters.search) params.append('search', filters.search);
        
        return `/leads/?${params.toString()}`;
      },
      providesTags: ['Lead'],
      transformResponse: (response: LeadsResponse) => {
        console.log('✅ Leads carregados:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao buscar leads:', response);
        return response;
      },
    }),

    // Buscar lead por ID
    getLeadById: builder.query<Lead, number>({
      query: (id) => `/leads/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Lead', id }],
      transformResponse: (response: Lead) => {
        console.log('✅ Lead carregado:', response);
        return response;
      },
    }),

    // Criar novo lead
    createLead: builder.mutation<Lead, Partial<Lead>>({
      query: (leadData) => ({
        url: '/leads/',
        method: 'POST',
        body: leadData,
      }),
      invalidatesTags: ['Lead', 'LeadStats'],
      transformResponse: (response: Lead) => {
        console.log('✅ Lead criado:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao criar lead:', response);
        return response;
      },
    }),

    // Atualizar lead
    updateLead: builder.mutation<Lead, { id: number; data: Partial<Lead> }>({
      query: ({ id, data }) => ({
        url: `/leads/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Lead', id },
        'Lead',
        'LeadStats',
      ],
      transformResponse: (response: Lead) => {
        console.log('✅ Lead atualizado:', response);
        return response;
      },
    }),

    // Deletar lead
    deleteLead: builder.mutation<void, number>({
      query: (id) => ({
        url: `/leads/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lead', 'LeadStats'],
      transformResponse: () => {
        console.log('✅ Lead deletado');
      },
    }),

    // Mudar status do lead
    mudarStatus: builder.mutation<Lead, { id: number; status: Lead['status'] }>({
      query: ({ id, status }) => ({
        url: `/leads/${id}/mudar_status/`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Lead', id },
        'Lead',
        'LeadStats',
      ],
      transformResponse: (response: Lead) => {
        console.log('✅ Status atualizado:', response);
        return response;
      },
    }),

    // Obter estatísticas
    getEstatisticas: builder.query<LeadStats, string | void>({
      query: (escola_id) => {
        const params = escola_id ? `?escola_id=${escola_id}` : '';
        return `/leads/estatisticas/${params}`;
      },
      providesTags: ['LeadStats'],
      transformResponse: (response: LeadStats) => {
        console.log('✅ Estatísticas carregadas:', response);
        return response;
      },
    }),

    // Buscar leads recentes
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
          // ✅ Verificar se a resposta é ok
          if (!response.ok) {
            throw new Error('Erro ao exportar CSV');
          }
          return response.blob();
        },
      }),
      transformResponse: (response: Blob) => {
        console.log('✅ CSV exportado');
        return response;
      },
      transformErrorResponse: (error) => {
        console.error('❌ Erro ao exportar CSV:', error);
        return error;
      },
    }),
  }),
});

// ✅ CORRETO - Exportar hooks
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

// ✅ CORRETO - Exportar tipos
export type { Lead, LeadsResponse, LeadStats, LeadFilters, ExportCSVParams };