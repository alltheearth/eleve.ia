// src/components/layout/Header/index.tsx
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { Bell, ChevronDown, Power, Settings, User, LogOut } from 'lucide-react';
import InstanceModal from './InstanceModal';
import ConfirmModal from './ConfirmModal';
import { useConnectInstanceMutation, useDisconnectInstanceMutation } from '../../../services/uzapiApi';

// Mapeamento de títulos por módulo
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
  
  const [showMenu, setShowMenu] = useState(false);
  const [showInstanceModal, setShowInstanceModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [instanceActive, setInstanceActive] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  const [connectInstance, { isLoading: isConnecting }] = useConnectInstanceMutation();
  const [disconnectInstance, { isLoading: isDisconnecting }] = useDisconnectInstanceMutation();

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

  // Handler para ativar instância
  const handleActivateInstance = () => {
    setShowMenu(false);
    setShowInstanceModal(true);
  };

  // Handler para desativar instância
  const handleDeactivateInstance = () => {
    setShowMenu(false);
    setShowConfirmModal(true);
  };

  // Confirmar desativação
  const confirmDeactivation = async () => {
    try {
      await disconnectInstance({ instanceUrl: 'default' }).unwrap();
      setInstanceActive(false);
      setShowConfirmModal(false);
      console.log('✅ Instância desativada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao desativar instância:', error);
    }
  };

  // Confirmar ativação (após scan do QR code)
  const confirmActivation = async () => {
    try {
      await connectInstance({ instanceUrl: 'default' }).unwrap();
      setInstanceActive(true);
      setShowInstanceModal(false);
      console.log('✅ Instância ativada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao ativar instância:', error);
    }
  };

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
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
            <div className={`w-2 h-2 rounded-full ${instanceActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className={`font-semibold text-sm ${instanceActive ? 'text-green-700' : 'text-gray-700'}`}>
              {instanceActive ? 'Agente Ativo' : 'Agente Inativo'}
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
                    onClick={() => {
                      setShowMenu(false);
                      // Navegar para perfil
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-left"
                  >
                    <User size={18} className="text-gray-600" />
                    <span className="text-gray-700">Meu Perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Navegar para configurações
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-left"
                  >
                    <Settings size={18} className="text-gray-600" />
                    <span className="text-gray-700">Configurações</span>
                  </button>

                  {/* Gerenciar Instância */}
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  {instanceActive ? (
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
                    onClick={() => {
                      setShowMenu(false);
                      // Fazer logout
                    }}
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
        onClose={() => setShowInstanceModal(false)}
        onConfirm={confirmActivation}
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