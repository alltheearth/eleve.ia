// src/components/layout/Header/index.tsx - CORRIGIDO COM loggedIn
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { Bell, ChevronDown, Power, Settings, User, LogOut } from 'lucide-react';
import InstanceModal from './InstanceModal';
import ConfirmModal from './ConfirmModal';
import { 
  useConnectInstanceMutation, 
  useDisconnectInstanceMutation, 
  useGetInstanceStatusQuery 
} from '../../../services/uzapiApi';

const MODULE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Bem-vindo de volta ao Eleve.ia'
  },
  information: {
    title: 'Informações da Escola',
    subtitle: 'Gerencie todos os dados da sua instituição'
  },
  calendar: {
    title: 'Calendário Escolar',
    subtitle: 'Gerencie os eventos da sua instituição'
  },
  contatos: {
    title: 'Contatos',
    subtitle: 'Gerencie seus contatos'
  },
  faqs: {
    title: 'Perguntas Frequentes (FAQs)',
    subtitle: 'Gerencie as perguntas mais comuns'
  },
  leads: {
    title: 'Leads',
    subtitle: 'Gerencie seus leads e conversões'
  },
};

const Header = () => {
  const activeModule = useSelector((state: RootState) => state.moduleActive.activeModule);
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Estados locais
  const [showMenu, setShowMenu] = useState(false);
  const [showInstanceModal, setShowInstanceModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [isPolling, setIsPolling] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // RTK Query Hooks - Polling desabilitado por padrão
  const { data: instanceStatus, refetch } = useGetInstanceStatusQuery(undefined, {
    pollingInterval: 0, // Desabilitado por padrão
    skip: false,
  });
  
  const [connectInstance, { isLoading: isConnecting }] = useConnectInstanceMutation();
  const [disconnectInstance, { isLoading: isDisconnecting }] = useDisconnectInstanceMutation();

  // ✅ CORRIGIDO: Usar loggedIn ao invés de connected
  const instanceActive = instanceStatus?.status?.loggedIn || false;
  const instanceConnecting = instanceStatus?.instance?.status === 'connecting';

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ POLLING MANUAL - Verificar status a cada 5 segundos quando modal estiver aberto
  useEffect(() => {
    if (isPolling && showInstanceModal) {
      console.log('🔄 Iniciando polling manual...');
      
      // Fazer primeira verificação imediatamente
      refetch();
      
      // Configurar intervalo de 5 segundos
      pollingIntervalRef.current = setInterval(() => {
        console.log('🔄 Verificando status da instância... (loggedIn:', instanceStatus?.status?.loggedIn, ')');
        refetch();
      }, 5000);
    } else {
      // Limpar intervalo quando não estiver fazendo polling
      if (pollingIntervalRef.current) {
        console.log('⏹️ Parando polling');
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isPolling, showInstanceModal, refetch]);

  // ✅ CORRIGIDO: Detectar quando efetivamente logado (não apenas conectado)
  useEffect(() => {
    if (instanceActive && showInstanceModal && isPolling) {
      console.log('✅ Usuário efetivamente logado! Fechando modal em 2 segundos...');
      
      setTimeout(() => {
        handleCloseInstanceModal();
      }, 2000);
    }
  }, [instanceActive, showInstanceModal, isPolling]);

  // Obter título e subtítulo do módulo ativo
  const { title, subtitle } = MODULE_TITLES[activeModule] || { 
    title: 'Dashboard', 
    subtitle: 'Bem-vindo de volta ao Eleve.ia' 
  };

  // Obter iniciais do usuário
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'AD';
  };

  // ✅ Handler para ativar instância - SEM FECHAR O MODAL
  const handleActivateInstance = async () => {
    setShowMenu(false);
    
    try {
      console.log('🚀 Ativando instância...');
      const response = await connectInstance().unwrap();
      console.log('✅ Resposta da conexão:', response);
      
      // Se retornar QR code, salvar e abrir modal
      if (response.instance.qrcode) {
        setQrCodeData(response.instance.qrcode);
        setShowInstanceModal(true);
        setIsPolling(true); // ✅ Iniciar polling
      } else {
        console.warn('⚠️ Nenhum QR Code retornado');
      }
    } catch (error) {
      console.error('❌ Erro ao ativar instância:', error);
      setIsPolling(false);
    }
  };

  // Handler para desativar instância
  const handleDeactivateInstance = () => {
    setShowMenu(false);
    setShowConfirmModal(true);
  };

  // Confirmar desativação
  const confirmDeactivation = async () => {
    try {
      console.log('🔌 Desativando instância...');
      await disconnectInstance().unwrap();
      setShowConfirmModal(false);
      console.log('✅ Instância desativada com sucesso');
      refetch(); // Forçar atualização do status
    } catch (error) {
      console.error('❌ Erro ao desativar instância:', error);
    }
  };

  // ✅ Fechar modal e parar polling
  const handleCloseInstanceModal = () => {
    console.log('🚪 Fechando modal de instância');
    setShowInstanceModal(false);
    setQrCodeData('');
    setIsPolling(false); // ✅ Parar polling
    refetch(); // Atualizar status final
  };

  // Determinar cor e texto do status
  const getStatusDisplay = () => {
    if (instanceActive) {
      return {
        color: 'bg-green-100',
        dotColor: 'bg-green-500',
        textColor: 'text-green-700',
        text: 'Agente Ativo',
        animate: true
      };
    }
    
    if (instanceConnecting) {
      return {
        color: 'bg-yellow-100',
        dotColor: 'bg-yellow-500',
        textColor: 'text-yellow-700',
        text: 'Conectando...',
        animate: true
      };
    }
    
    return {
      color: 'bg-gray-100',
      dotColor: 'bg-gray-400',
      textColor: 'text-gray-700',
      text: 'Agente Inativo',
      animate: false
    };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <>
      <header className="bg-white shadow-sm p-6 flex justify-between items-center border-b border-gray-200">
        {/* Título Dinâmico */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>

        {/* Ações e Perfil */}
        <div className="flex items-center gap-4">
          {/* Status da Instância */}
          <div className={`flex items-center gap-2 px-4 py-2 ${statusDisplay.color} rounded-full`}>
            <div className={`w-2 h-2 rounded-full ${statusDisplay.dotColor} ${statusDisplay.animate ? 'animate-pulse' : ''}`}></div>
            <span className={`font-semibold text-sm ${statusDisplay.textColor}`}>
              {statusDisplay.text}
            </span>
          </div>

          {/* Notificações */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Menu do Usuário */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 transition"
            >
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {getUserInitials()}
              </div>
              <ChevronDown size={16} className="text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* Info do Usuário */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">
                    {user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user?.username || 'Usuário'}
                  </p>
                  <p className="text-sm text-gray-600">{user?.email || 'email@exemplo.com'}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-left"
                  >
                    <User size={18} className="text-gray-600" />
                    <span className="text-gray-700">Meu Perfil</span>
                  </button>

                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-left"
                  >
                    <Settings size={18} className="text-gray-600" />
                    <span className="text-gray-700">Configurações</span>
                  </button>

                  <div className="border-t border-gray-200 my-2"></div>
                  
                  {instanceActive || instanceConnecting ? (
                    <button
                      onClick={handleDeactivateInstance}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition text-left"
                    >
                      <Power size={18} className="text-red-600" />
                      <span className="text-red-600 font-semibold">Desativar Instância</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleActivateInstance}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-green-50 transition text-left"
                    >
                      <Power size={18} className="text-green-600" />
                      <span className="text-green-600 font-semibold">Ativar Instância</span>
                    </button>
                  )}

                  <div className="border-t border-gray-200 my-2"></div>

                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-left"
                  >
                    <LogOut size={18} className="text-gray-600" />
                    <span className="text-gray-700">Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Ativação (QR Code) */}
      <InstanceModal
        isOpen={showInstanceModal}
        onClose={handleCloseInstanceModal}
        qrCode={qrCodeData}
        instanceStatus={instanceStatus}
        isLoading={isConnecting}
      />

      {/* Modal de Confirmação de Desativação */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDeactivation}
        isLoading={isDisconnecting}
        title="Desativar Instância"
        message="Tem certeza que deseja desativar a instância? O agente de IA não poderá responder mensagens enquanto estiver inativo."
        confirmText="Desativar"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </>
  );
};

export default Header;