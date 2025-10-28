// src/services/schoolApi.ts - RTK Query para gerenciar Schools
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'http://localhost:8000/api';


interface Event {
    "id": number,
    "usuario_id": number,
    "escola": number,
    "evento_nome": string,
    "data": string,
    "evento": string,
    "tipo": string,
    "criado_em": string,
    "atualizado_em": string
}

interface EventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export const eventsApi = createApi({
  reducerPath: 'EventsApi',
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
  tagTypes: ['Event'],
  endpoints: (builder) => ({
    // Buscar todas as eventos do usuário
    getEvents: builder.query<EventsResponse, void>({
      query: () => '/eventos/',
      providesTags: ['Event'],
      transformResponse: (response: EventsResponse) => {
        console.log('✅ eventos carregadas:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao buscar eventos:', response);
        return response;
      },
    }),

    // Buscar evento por ID
    getEventById: builder.query<Event, number>({
      query: (id) => `/eventos/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
      transformResponse: (response: Event) => {
        console.log('✅ Evento carregado:', response);
        return response;
      },
    }),

    // Criar nova evento
    createEvent: builder.mutation<Event, Partial<Event>>({
      query: (EventData) => ({
        url: '/eventos/',
        method: 'POST',
        body: EventData,
      }),
      invalidatesTags: ['Event'],
      transformResponse: (response: Event) => {
        console.log('✅ Evento criado:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('❌ Erro ao criar Event:', response);
        return response;
      },
    }),

    // Atualizar evento
    updateEvent: builder.mutation<Event, { id: number; data: Partial<Event> }>({
      query: ({ id, data }) => ({
        url: `/eventos/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Event', id }, 'Event'],
      transformResponse: (response: Event) => {
        console.log('✅ Evento atualizado:', response);
        return response;
      },
    }),

    // Deletar evento
    deleteEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/eventos/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
      transformResponse: () => {
        console.log('✅ Evento deletado');
      },
    }),
  }),
});

// ============================================
// EXPORTAR HOOKS GERADOS AUTOMATICAMENTE
// ============================================
export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;

// Tipos auxiliares
export type { Event, EventsResponse };