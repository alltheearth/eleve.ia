// src/services/uzapiApi.ts - API COM TOKEN CORRETO
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type { SchoolResponse } from './schoolApi';

const API_URL = 'https://eleve.uazapi.com';

// Interfaces baseadas nas respostas da API
interface InstanceData {
  id: string;
  token: string;
  status: 'connecting' | 'connected' | 'disconnected';
  paircode: string;
  qrcode: string;
  name: string;
  profileName: string;
  profilePicUrl: string;
  isBusiness: boolean;
  plataform: string;
  systemName: string;
  owner: string;
  current_presence: string;
  lastDisconnect: string;
  lastDisconnectReason: string;
  created: string;
  updated: string;
  currentTime: string;
}

interface ConnectResponse {
  connected: boolean;
  instance: InstanceData;
  jid: string | null;
  loggedIn: boolean;
}

interface DisconnectResponse {
  info: string;
  instance: InstanceData;
  response: string;
}

interface StatusResponse {
  instance: InstanceData;
  status: {
    connected: boolean;
    jid: string | null;
    loggedIn: boolean;
  };
}

export const uzapiApi = createApi({
  reducerPath: 'uzapiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      
      // Pegar token_mensagens da primeira escola
      const schoolApiState = state.schoolApi;
      const schoolsQuery: SchoolResponse = schoolApiState?.queries?.['getSchools'];
      console.log(schoolsQuery)
      const schools = schoolsQuery?.data?.results;
      console.log(schools)
      
      if (schools && schools.length > 0) {
        const token = schools[0].token_mensagens;
        if (token) {
          // Formato correto: Token (não Bearer)
          headers.set('Authorization', `Token ${token}`);
          console.log('🔑 Token enviado:', token);
        } else {
          console.warn('⚠️ Escola sem token_mensagens');
        }
      } else {
        console.warn('⚠️ Nenhuma escola encontrada');
      }
      
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Instance'],
  endpoints: (builder) => ({
    // Verificar status da instância
    getInstanceStatus: builder.query<StatusResponse, void>({
      query: () => '/instance/status',
      providesTags: ['Instance'],
      transformResponse: (response: StatusResponse) => {
        console.log('📊 Status da instância:', response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error('❌ Erro ao buscar status:', response);
        if (response.status === 401) {
          console.error('❌ Token inválido ou não configurado');
        }
        return response;
      },
    }),

    // Conectar instância
    connectInstance: builder.mutation<ConnectResponse, void>({
      query: () => ({
        url: '/instance/connect',
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['Instance'],
      transformResponse: (response: ConnectResponse) => {
        console.log('✅ Conectando instância:', response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error('❌ Erro ao conectar instância:', response);
        return response;
      },
    }),

    // Desconectar instância
    disconnectInstance: builder.mutation<DisconnectResponse, void>({
      query: () => ({
        url: '/instance/disconnect',
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['Instance'],
      transformResponse: (response: DisconnectResponse) => {
        console.log('✅ Desconectando instância:', response);
        return response;
      },
    }),
  }),
});

export const {
  useGetInstanceStatusQuery,
  useConnectInstanceMutation,
  useDisconnectInstanceMutation,
} = uzapiApi;

export type { InstanceData, ConnectResponse, DisconnectResponse, StatusResponse };