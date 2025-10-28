// src/services/contactsApi.ts - RTK Query para gerenciar Contatos
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
;

interface Contact {
  id: number;
  usuario_id: number;
  escola: number;
  escola_nome: string;
  nome: string;
  email: string;
  telefone: string;
  data_nascimento?: string;
  status: 'ativo' | 'inativo';
  origem: string;
  ultima_interacao?: string;
  observacoes?: string;
  tags?: string;
  criado_em: string;
  atualizado_em: string;
}

interface ContactsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Contact[];
}

export const contactsApi = createApi({
  reducerPath: 'contactsApi',
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
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    // Buscar todos os contatos do usuário
    getContacts: builder.query<ContactsResponse, void>({
      query: () => '/contatos/',
      providesTags: ['Contact'],
      transformResponse: (response: ContactsResponse) => {
        console.log('✅ Contatos carregados:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao buscar contatos:', response);
        return response;
      },
    }),

    // Buscar contato por ID
    getContactById: builder.query<Contact, number>({
      query: (id) => `/contatos/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Contact', id }],
      transformResponse: (response: Contact) => {
        console.log('✅ Contato carregado:', response);
        return response;
      },
    }),

    // Criar novo contato
    createContact: builder.mutation<Contact, Partial<Contact>>({
      query: (contactData) => ({
        url: '/contatos/',
        method: 'POST',
        body: contactData,
      }),
      invalidatesTags: ['Contact'],
      transformResponse: (response: Contact) => {
        console.log('✅ Contato criado:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao criar contato:', response);
        return response;
      },
    }),

    // Atualizar contato
    updateContact: builder.mutation<Contact, { id: number; data: Partial<Contact> }>({
      query: ({ id, data }) => ({
        url: `/contatos/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Contact', id }, 'Contact'],
      transformResponse: (response: Contact) => {
        console.log('✅ Contato atualizado:', response);
        return response;
      },
    }),

    // Deletar contato
    deleteContact: builder.mutation<void, number>({
      query: (id) => ({
        url: `/contatos/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
      transformResponse: () => {
        console.log('✅ Contato deletado');
      },
    }),
  }),
});

// Exportar hooks gerados automaticamente
export const {
  useGetContactsQuery,
  useGetContactByIdQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactsApi;

// Tipos auxiliares
export type { Contact, ContactsResponse };