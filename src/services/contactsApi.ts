// src/services/schoolApi.ts - RTK Query para gerenciar Schools
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'http://localhost:8000/api';


interface Contact{
    "id": 1,
    "usuario_id": 1,
    "escola": 7,
    "escola_nome": "INSTITUTO DE EDUCAÇÂO CRISTÃ VINCLER",
    "email_principal": "contato@escola.com.br",
    "telefone_principal": "(11) 3000-0000",
    "whatsapp": "(11) 99999-0000",
    "instagram": "@colegioexemplo",
    "facebook": "Colégio Exemplo",
    "horario_aula": "07:30 - 17:30",
    "diretor": "José Silva",
    "email_diretor": "diretor@escola.com.br",
    "coordenador": "Maria Santos",
    "email_coordenador": "coord@escola.com.br",
    "atualizado_em": "2025-10-21T16:49:39.830888-03:00"
}

interface ContactsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export const contactsApi = createApi({
  reducerPath: 'ContactsApi',
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
    // Buscar todas as eventos do usuário
    getContacts: builder.query<ContactsResponse, void>({
      query: () => '/contatos/',
      providesTags: ['Contact'],
      transformResponse: (response: ContactsResponse) => {
        console.log('✅ Contatos carregadas:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao buscar Contactos:', response);
        return response;
      },
    }),

    // Buscar Contacto por ID
    getContactById: builder.query<Contact, number>({
      query: (id) => `/contatos/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Contact', id }],
      transformResponse: (response: Contact) => {
        console.log('✅ Contato carregado:', response);
        return response;
      },
    }),

    // Criar nova Contacto
    createContact: builder.mutation<Contact, Partial<Contact>>({
      query: (ContactData) => ({
        url: '/contatos/',
        method: 'POST',
        body: ContactData,
      }),
      invalidatesTags: ['Contact'],
      transformResponse: (response: Contact) => {
        console.log('✅ Contato criado:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao criar Contact:', response);
        return response;
      },
    }),

    // Atualizar Contacto
    updateContact: builder.mutation<Contact, { id: number; data: Partial<Contact> }>({
      query: ({ id, data }) => ({
        url: `/contatos/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Contact', id }, 'Contact'],
      transformResponse: (response: Contact) => {
        console.log('✅ Contato atualizado:', response);
        return response;
      },
    }),

    // Deletar Contacto
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

// ============================================
// EXPORTAR HOOKS GERADOS AUTOMATICAMENTE
// ============================================
export const {
  useGetContactsQuery,
  useGetContactByIdQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactsApi;

// Tipos auxiliares
export type { Contact, ContactsResponse };