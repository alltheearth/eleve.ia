import { useState, useEffect, type ChangeEvent } from 'react';
import { 
  useGetContactsQuery, 
  useCreateContactMutation, 
  useUpdateContactMutation, 
  useDeleteContactMutation,
  type Contact 
} from '../../services/contactsApi';
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import { Trash2, Edit2, Plus, Save, X, Users as UsersIcon, AlertCircle, Search, Phone, Mail, Calendar, Activity } from 'lucide-react';

interface ContactFormData {
  nome: string;
  email: string;
  telefone: string;
  data_nascimento?: string;
  status: 'ativo' | 'inativo';
  origem: string;
  ultima_interacao?: string;
  observacoes?: string;
  tags?: string;
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

export default function Contacts() {
  // Hook customizado - gerencia escola
  const { 
    currentSchool, 
    currentSchoolId,
    isLoading: schoolsLoading 
  } = useCurrentSchool();

  // RTK Query Hooks
  const { data: contactsData, isLoading: contactsLoading, error: contactsError, refetch } = useGetContactsQuery();
  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  // Estados
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoContato, setEditandoContato] = useState<Contact | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const [contatoParaDeletar, setContatoParaDeletar] = useState<number | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos');

  const [formData, setFormData] = useState<ContactFormData>({
    nome: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    status: 'ativo',
    origem: 'whatsapp',
    ultima_interacao: '',
    observacoes: '',
    tags: '',
  });

  // Limpar mensagens automaticamente
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  // Reset form
  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      data_nascimento: '',
      status: 'ativo',
      origem: 'whatsapp',
      ultima_interacao: '',
      observacoes: '',
      tags: '',
    });
    setEditandoContato(null);
    setMostrarFormulario(false);
  };

  // Carregar dados para edição
  const iniciarEdicao = (contato: Contact) => {
    setFormData({
      nome: contato.nome,
      email: contato.email,
      telefone: contato.telefone,
      data_nascimento: contato.data_nascimento || '',
      status: contato.status,
      origem: contato.origem,
      ultima_interacao: contato.ultima_interacao || '',
      observacoes: contato.observacoes || '',
      tags: contato.tags || '',
    });
    setEditandoContato(contato);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validação
  const validarFormulario = (): string | null => {
    if (!formData.nome.trim()) return 'Nome é obrigatório';
    if (formData.nome.trim().length < 3) return 'Nome deve ter no mínimo 3 caracteres';
    if (!formData.telefone.trim()) return 'Telefone é obrigatório';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Email inválido';
    }
    return null;
  };

  // CRIAR contato
  const adicionarContato = async () => {
    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'erro', texto: erro });
      return;
    }

    try {
      await createContact({
        ...formData,
        escola: parseInt(currentSchoolId),
      }).unwrap();
      
      setMensagem({ tipo: 'sucesso', texto: '✅ Contato adicionado com sucesso!' });
      resetForm();
      refetch();
    } catch (error: any) {
      setMensagem({ 
        tipo: 'erro', 
        texto: `❌ Erro ao adicionar contato: ${error.data?.detail || error.message || 'Erro desconhecido'}` 
      });
    }
  };

  // ATUALIZAR contato
  const atualizarContato = async () => {
    if (!editandoContato) return;

    const erro = validarFormulario();
    if (erro) {
      setMensagem({ tipo: 'erro', texto: erro });
      return;
    }

    try {
      await updateContact({ 
        id: editandoContato.id, 
        data: {
          ...formData,
          escola: parseInt(currentSchoolId),
        }
      }).unwrap();
      
      setMensagem({ tipo: 'sucesso', texto: '✅ Contato atualizado com sucesso!' });
      resetForm();
      refetch();
    } catch (error: any) {
      setMensagem({ 
        tipo: 'erro', 
        texto: `❌ Erro ao atualizar contato: ${error.data?.detail || error.message || 'Erro desconhecido'}` 
      });
    }
  };

  // DELETAR contato
  const confirmarDelecao = (id: number) => {
    setContatoParaDeletar(id);
  };

  const executarDelecao = async () => {
    if (!contatoParaDeletar) return;

    try {
      await deleteContact(contatoParaDeletar).unwrap();
      setMensagem({ tipo: 'sucesso', texto: '✅ Contato deletado com sucesso!' });
      setContatoParaDeletar(null);
      refetch();
    } catch (error: any) {
      setMensagem({ 
        tipo: 'erro', 
        texto: `❌ Erro ao deletar contato: ${error.data?.detail || error.message || 'Erro desconhecido'}` 
      });
    }
  };

  // Filtrar contatos
  const contatosFiltrados = contactsData?.results
    .filter(c => c.escola.toString() === currentSchoolId)
    .filter(c => {
      const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase()) ||
                         c.email.toLowerCase().includes(busca.toLowerCase()) ||
                         c.telefone.includes(busca);
      const matchStatus = filtroStatus === 'todos' || c.status === filtroStatus;
      return matchBusca && matchStatus;
    }) || [];

  // Estatísticas
  const stats = {
    total: contactsData?.results.filter(c => c.escola.toString() === currentSchoolId).length || 0,
    ativos: contactsData?.results.filter(c => c.escola.toString() === currentSchoolId && c.status === 'ativo').length || 0,
    inativos: contactsData?.results.filter(c => c.escola.toString() === currentSchoolId && c.status === 'inativo').length || 0,
    novosHoje: contactsData?.results.filter(c => {
      if (c.escola.toString() !== currentSchoolId) return false;
      const hoje = new Date().toISOString().split('T')[0];
      return c.criado_em.startsWith(hoje);
    }).length || 0,
  };

  // Formatar data
  const formatarData = (data: string): string => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatarDataHora = (data: string): string => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // LOADING
  if (contactsLoading || schoolsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <UsersIcon className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-600" />
          <p className="text-gray-600 font-semibold">Carregando contatos...</p>
        </div>
      </div>
    );
  }

  // Sem escola cadastrada
  if (!currentSchool) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <UsersIcon className="mx-auto mb-4 h-16 w-16 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma escola cadastrada</h2>
          <p className="text-gray-600">Você precisa cadastrar uma escola antes de gerenciar contatos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Mensagens */}
            {mensagem && (
              <div className={`p-4 rounded-lg border-l-4 ${
                mensagem.tipo === 'sucesso' 
                  ? 'bg-green-50 border-green-500 text-green-700' 
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{mensagem.texto}</span>
                  <button onClick={() => setMensagem(null)} className="text-gray-500 hover:text-gray-700">
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Erro ao carregar */}
            {contactsError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={20} />
                  <span className="font-semibold">Erro ao carregar contatos</span>
                </div>
              </div>
            )}

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                label="Total de Contatos" 
                value={stats.total} 
                color="bg-blue-100 text-blue-700"
                icon={<UsersIcon size={24} />}
              />
              <StatCard 
                label="Contatos Ativos" 
                value={stats.ativos} 
                color="bg-green-100 text-green-700"
                icon={<Activity size={24} />}
              />
              <StatCard 
                label="Contatos Inativos" 
                value={stats.inativos} 
                color="bg-gray-100 text-gray-700"
                icon={<Activity size={24} />}
              />
              <StatCard 
                label="Novos Hoje" 
                value={stats.novosHoje} 
                color="bg-orange-100 text-orange-700"
                icon={<Calendar size={24} />}
              />
            </div>

            {/* Filtros e Busca */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por nome, email ou telefone..."
                    value={busca}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setBusca(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <select
                  value={filtroStatus}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFiltroStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>

                <button
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <Plus size={20} />
                  Novo Contato
                </button>
              </div>
            </div>

            {/* Formulário */}
            {mostrarFormulario && (
              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editandoContato ? '✏️ Editar Contato' : '➕ Novo Contato'}
                  </h3>
                  <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nome *</label>
                    <input
                      type="text"
                      placeholder="Nome completo"
                      value={formData.nome}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, nome: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Telefone *</label>
                    <input
                      type="tel"
                      placeholder="(11) 99999-0000"
                      value={formData.telefone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, telefone: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Data de Nascimento</label>
                    <input
                      type="date"
                      value={formData.data_nascimento}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, data_nascimento: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Origem</label>
                    <select
                      value={formData.origem}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({...formData, origem: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="site">Site</option>
                      <option value="telefone">Telefone</option>
                      <option value="presencial">Presencial</option>
                      <option value="email">Email</option>
                      <option value="indicacao">Indicação</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option value="ativo">✅ Ativo</option>
                      <option value="inativo">⛔ Inativo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Tags (separadas por vírgula)</label>
                    <input
                      type="text"
                      placeholder="interessado, aguardando, urgente"
                      value={formData.tags}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, tags: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">Observações</label>
                    <textarea
                      placeholder="Informações adicionais sobre o contato..."
                      value={formData.observacoes}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, observacoes: e.target.value})}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  {editandoContato ? (
                    <button
                      onClick={atualizarContato}
                      disabled={isUpdating}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                    >
                      <Save size={20} />
                      {isUpdating ? 'Atualizando...' : 'Atualizar'}
                    </button>
                  ) : (
                    <button
                      onClick={adicionarContato}
                      disabled={isCreating}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                    >
                      <Plus size={20} />
                      {isCreating ? 'Adicionando...' : 'Adicionar'}
                    </button>
                  )}

                  <button
                    onClick={resetForm}
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Tabela de Contatos */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="p-3 text-left font-bold text-gray-900">#</th>
                    <th className="p-3 text-left font-bold text-gray-900">Nome</th>
                    <th className="p-3 text-left font-bold text-gray-900">Email</th>
                    <th className="p-3 text-left font-bold text-gray-900">Telefone</th>
                    <th className="p-3 text-left font-bold text-gray-900">Status</th>
                    <th className="p-3 text-left font-bold text-gray-900">Origem</th>
                    <th className="p-3 text-left font-bold text-gray-900">Última Interação</th>
                    <th className="p-3 text-left font-bold text-gray-900">Cadastro</th>
                    <th className="p-3 text-left font-bold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contatosFiltrados.length > 0 ? (
                    contatosFiltrados.map((contato) => (
                      <tr key={contato.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3 text-gray-900 font-semibold">{contato.id}</td>
                        <td className="p-3 text-gray-900 font-medium">{contato.nome}</td>
                        <td className="p-3 text-gray-700">
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            {contato.email || '-'}
                          </div>
                        </td>
                        <td className="p-3 text-gray-700">
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-gray-400" />
                            {contato.telefone}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            contato.status === 'ativo' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {contato.status === 'ativo' ? '✅ Ativo' : '⛔ Inativo'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                            {contato.origem}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700 text-sm">
                          {contato.ultima_interacao ? formatarDataHora(contato.ultima_interacao) : '-'}
                        </td>
                        <td className="p-3 text-gray-700 text-sm">{formatarData(contato.criado_em)}</td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => iniciarEdicao(contato)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-sm"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => confirmarDelecao(contato.id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-gray-500">
                        <UsersIcon className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                        <p className="font-semibold">Nenhum contato encontrado</p>
                        <p className="text-sm">
                          {busca || filtroStatus !== 'todos'
                            ? 'Tente ajustar os filtros de busca'
                            : 'Adicione o primeiro contato'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Info de Resultados */}
            {contatosFiltrados.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 font-semibold">
                  Mostrando <span className="text-blue-600 font-bold">{contatosFiltrados.length}</span> de{' '}
                  <span className="text-blue-600 font-bold">{stats.total}</span> contatos
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Confirmação de Deleção */}
      {contatoParaDeletar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar este contato? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setContatoParaDeletar(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={executarDelecao}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
              >
                {isDeleting ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <div className={`${color} p-4 rounded-lg shadow-md`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold opacity-80">{label}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}