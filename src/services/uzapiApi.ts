import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useCurrentSchool } from '../hooks/useCurrentSchool';

const API_URL = 'https://eleve.uazapi.com';

export const uzapiApi = createApi({
  reducerPath: 'uzapiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const school = useCurrentSchool()
      const token = school.currentSchool?.token_mensagens;
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({

    // Verificar status da instância
    getInstanceStatus: builder.query<any, void>({
      query: () => '/instance/status/',
    }),

    // Conectar instância
    connectInstance: builder.mutation<any, void>({
      query: (body) => ({
        url: '/instance/connect/',
        method: 'POST',
        body,
      }),
    }),
     // Conectar instância
    disconnectInstance: builder.mutation<any, void>({
      query: (body) => ({
        url: '/instance/disconnect/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetInstanceStatusQuery,
  useConnectInstanceMutation,
  useDisconnectInstanceMutation
} = uzapiApi;
