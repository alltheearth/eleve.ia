// src/services/schoolApi.ts - RTK Query para gerenciar Schools
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'http://localhost:8000/api';

interface NiveisEnsino {
  infantil?: boolean;
  fundamentoI?: boolean;
  fundamentoII?: boolean;
  medio?: boolean;
}

interface School {
  id: number;
  usuario_id: number;
  usuario_username: string;
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
  niveis_ensino: {
    niveis_ensino: NiveisEnsino | null;
  };
  criado_em: string;
  atualizado_em: string;
}

interface SchoolResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: School[];
}

// ============================================
// RTK QUERY API
// ============================================
export const schoolApi = createApi({
  reducerPath: 'schoolApi',
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
  tagTypes: ['School'],
  endpoints: (builder) => ({
    // Buscar todas as escolas do usuário
    getSchools: builder.query<SchoolResponse, void>({
      query: () => '/escolas/',
      providesTags: ['School'],
      transformResponse: (response: SchoolResponse) => {
        console.log('✅ Escolas carregadas:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao buscar escolas:', response);
        return response;
      },
    }),

    // Buscar escola por ID
    getSchoolById: builder.query<School, number>({
      query: (id) => `/escolas/${id}/`,
      providesTags: (result, error, id) => [{ type: 'School', id }],
      transformResponse: (response: School) => {
        console.log('✅ Escola carregada:', response);
        return response;
      },
    }),

    // Criar nova escola
    createSchool: builder.mutation<School, Partial<School>>({
      query: (schoolData) => ({
        url: '/escolas/',
        method: 'POST',
        body: schoolData,
      }),
      invalidatesTags: ['School'],
      transformResponse: (response: School) => {
        console.log('✅ Escola criada:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao criar escola:', response);
        return response;
      },
    }),

    // Atualizar escola
    updateSchool: builder.mutation<School, { id: number; data: Partial<School> }>({
      query: ({ id, data }) => ({
        url: `/escolas/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'School', id }, 'School'],
      transformResponse: (response: School) => {
        console.log('✅ Escola atualizada:', response);
        return response;
      },
    }),

    // Deletar escola
    deleteSchool: builder.mutation<void, number>({
      query: (id) => ({
        url: `/escolas/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['School'],
      transformResponse: () => {
        console.log('✅ Escola deletada');
      },
    }),
  }),
});

// ============================================
// EXPORTAR HOOKS GERADOS AUTOMATICAMENTE
// ============================================
export const {
  useGetSchoolsQuery,
  useGetSchoolByIdQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
} = schoolApi;

// Tipos auxiliares
export type { School, SchoolResponse, NiveisEnsino };