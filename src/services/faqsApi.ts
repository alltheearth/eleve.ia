// src/services/schoolApi.ts - RTK Query para gerenciar Schools
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'http://localhost:8000/api';


interface Faqs {
    "id": number,
    "usuario_id": number,
    "escola": number,
    "escola_nome": string,
    "pergunta": string,
    "resposta": string,
    "categoria": string,
    "status": string,
    "criado_em": string,
    "atualizado_em": string
}

interface FaqsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Faqs[];
}

export const faqsApi = createApi({
  reducerPath: 'faqsApi',
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
  tagTypes: ['Faq'],
  endpoints: (builder) => ({
    // Buscar todas as escolas do usuário
    getFaqs: builder.query<FaqsResponse, void>({
      query: () => '/faqs/',
      providesTags: ['Faq'],
      transformResponse: (response: FaqsResponse) => {
        console.log('✅ Escolas carregadas:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao buscar escolas:', response);
        return response;
      },
    }),

    // Buscar escola por ID
    getFaqById: builder.query<Faqs, number>({
      query: (id) => `/faqs/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Faq', id }],
      transformResponse: (response: Faqs) => {
        console.log('✅ Escola carregada:', response);
        return response;
      },
    }),

    // Criar nova escola
    createFaq: builder.mutation<Faqs, Partial<Faqs>>({
      query: (faqData) => ({
        url: '/faqs/',
        method: 'POST',
        body: faqData,
      }),
      invalidatesTags: ['Faq'],
      transformResponse: (response: Faqs) => {
        console.log('✅ Faq criada:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao criar faq:', response);
        return response;
      },
    }),

    // Atualizar escola
    updateFaq: builder.mutation<Faqs, { id: number; data: Partial<Faqs> }>({
      query: ({ id, data }) => ({
        url: `/faqs/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Faq', id }, 'Faq'],
      transformResponse: (response: Faqs) => {
        console.log('✅ Faq atualizada:', response);
        return response;
      },
    }),

    // Deletar escola
    deleteFaq: builder.mutation<void, number>({
      query: (id) => ({
        url: `/faqs/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faq'],
      transformResponse: () => {
        console.log('✅ Faq deletada');
      },
    }),
  }),
});

// ============================================
// EXPORTAR HOOKS GERADOS AUTOMATICAMENTE
// ============================================
export const {
  useGetFaqsQuery,
  useGetFaqByIdQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqsApi;

// Tipos auxiliares
export type { Faqs, FaqsResponse };