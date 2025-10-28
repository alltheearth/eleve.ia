import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'https://eleve.uazapi.com';

export const uzapiApi = createApi({
  reducerPath: 'uzapiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
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
    connectInstance: builder.mutation<any, { instanceUrl: string }>({
      query: (body) => ({
        url: '/instance/disconnect/',
        method: 'POST',
        body,
      }),
    }),
     // Conectar instância
    disconnectInstance: builder.mutation<any, { instanceUrl: string }>({
      query: (body) => ({
        url: '/instance/connect/',
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
