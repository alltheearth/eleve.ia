// src/hooks/useInstance.ts - Hook corrigido
import { useEffect, useState } from 'react';
import { useGetSchoolsQuery } from '../services/schoolApi';
import { 
  useGetInstanceStatusQuery,
  useConnectInstanceMutation,
  useDisconnectInstanceMutation 
} from '../services/uzapiApi';

export function useInstance() {
  const [hasToken, setHasToken] = useState(false);
  
  // Buscar escolas primeiro
  const { data: schoolsData, isLoading: isLoadingSchools } = useGetSchoolsQuery();
  
  // Verificar se temos escola com token
  useEffect(() => {
    if (schoolsData?.results?.[0]) {
      const school = schoolsData.results[0];
      const token = school.token_mensagens;
      
      if (token && token.trim() !== '') {
        setHasToken(true);
        console.log('✅ Token disponível:', token);
      } else {
        setHasToken(false);
        console.warn('⚠️ Escola encontrada mas sem token_mensagens configurado');
      }
    }
  }, [schoolsData]);

  // Só fazer query se tiver token E escola carregada
  const shouldSkip = !hasToken || isLoadingSchools;
  
  const { 
    data: instanceStatus, 
    isLoading: isLoadingStatus,
    error: statusError,
    refetch 
  } = useGetInstanceStatusQuery(undefined, {
    skip: shouldSkip,
    pollingInterval: hasToken && !isLoadingSchools ? 5000 : undefined,
  });

  const [connectInstance, { isLoading: isConnecting }] = useConnectInstanceMutation();
  const [disconnectInstance, { isLoading: isDisconnecting }] = useDisconnectInstanceMutation();

  // Estados derivados
  const isConnected = instanceStatus?.status?.connected || false;
  const isConnecting_Status = instanceStatus?.instance?.status === 'connecting';
  const isDisconnected = instanceStatus?.instance?.status === 'disconnected';

  // Log para debug
  useEffect(() => {
    if (statusError) {
      console.error('❌ Erro no status da instância:', statusError);
    }
  }, [statusError]);

  return {
    // Estados
    hasToken,
    isConnected,
    isConnecting: isConnecting_Status,
    isDisconnected,
    instanceStatus,
    
    // Loading states
    isLoading: isLoadingSchools || isLoadingStatus,
    isLoadingSchools,
    isLoadingStatus,
    
    // Actions
    connectInstance,
    disconnectInstance,
    refetch,
    
    // Loading actions
    isConnectingAction: isConnecting,
    isDisconnectingAction: isDisconnecting,
    
    // Error
    error: statusError,
  };
}