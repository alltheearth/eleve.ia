import { useState, type ChangeEvent } from 'react';
import { Download, Trash2 } from 'lucide-react';

interface Lead {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  status: 'novo' | 'contato' | 'qualificado' | 'conversao' | 'perdido';
  data: string;
  origem: string;
}

interface NovoLead {
  nome: string;
  email: string;
  telefone: string;
  status: 'novo' | 'contato' | 'qualificado' | 'conversao' | 'perdido';
  origem: string;
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

type StatusFilter = 'todos' | 'novo' | 'contato' | 'qualificado' | 'conversao' | 'perdido';

export default function Leads() {
  const [filtroStatus, setFiltroStatus] = useState<StatusFilter>('todos');
  const [buscaTexto, setBuscaTexto] = useState<string>('');

  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 99900-1234', status: 'novo', data: '15/10/2024', origem: 'Site' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(21) 98765-4321', status: 'contato', data: '14/10/2024', origem: 'WhatsApp' },
    { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', telefone: '(31) 91234-5678', status: 'qualificado', data: '10/10/2024', origem: 'Site' },
    { id: 4, nome: 'Ana Oliveira', email: 'ana@email.com', telefone: '(41) 99876-5432', status: 'novo', data: '09/10/2024', origem: 'Indicação' },
    { id: 5, nome: 'Carlos Mendes', email: 'carlos@email.com', telefone: '(51) 98765-4321', status: 'conversao', data: '08/10/2024', origem: 'Site' },
    { id: 6, nome: 'Lucia Ferreira', email: 'lucia@email.com', telefone: '(61) 99999-8888', status: 'perdido', data: '05/10/2024', origem: 'Ligação' },
  ]);

  const [novoLead, setNovoLead] = useState<NovoLead>({
    nome: '',
    email: '',
    telefone: '',
    status: 'novo',
    origem: 'Site'
  });

  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);

  // Filtrar leads
  const leadsFiltrados = leads.filter(lead => {
    const matchStatus = filtroStatus === 'todos' || lead.status === filtroStatus;
    const matchBusca = lead.nome.toLowerCase().includes(buscaTexto.toLowerCase()) || 
                       lead.email.toLowerCase().includes(buscaTexto.toLowerCase());
    return matchStatus && matchBusca;
  });

  // Adicionar novo lead
  const adicionarLead = (): void => {
    if (novoLead.nome && novoLead.email && novoLead.telefone) {
      const dataAtual = new Date();
      const dataFormatada = `${String(dataAtual.getDate()).padStart(2, '0')}/${String(dataAtual.getMonth() + 1).padStart(2, '0')}/${dataAtual.getFullYear()}`;
      
      setLeads([...leads, {
        id: Math.max(...leads.map(l => l.id), 0) + 1,
        ...novoLead,
        data: dataFormatada
      }]);
      setNovoLead({ nome: '', email: '', telefone: '', status: 'novo', origem: 'Site' });
      setMostrarFormulario(false);
    }
  };

  // Deletar lead
  const deletarLead = (id: number): void => {
    setLeads(leads.filter(lead => lead.id !== id));
  };

  // Atualizar status
  const atualizarStatus = (id: number, novoStatus: Lead['status']): void => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, status: novoStatus } : lead
    ));
  };

  // Calcular estatísticas
  const stats = {
    total: leads.length,
    novo: leads.filter(l => l.status === 'novo').length,
    contato: leads.filter(l => l.status === 'contato').length,
    qualificado: leads.filter(l => l.status === 'qualificado').length,
    conversao: leads.filter(l => l.status === 'conversao').length,
    perdido: leads.filter(l => l.status === 'perdido').length,
  };

  // Exportar para CSV
  const exportarCSV = (): void => {
    const headers = ['#', 'Nome', 'Email', 'Telefone', 'Status', 'Data', 'Origem'];
    const rows = leadsFiltrados.map(lead => [
      lead.id, lead.nome, lead.email, lead.telefone, lead.status, lead.data, lead.origem
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
  };

  const getStatusColor = (status: Lead['status']): string => {
    const colors: Record<Lead['status'], string> = {
      novo: 'bg-blue-100 text-blue-700',
      contato: 'bg-yellow-100 text-yellow-700',
      qualificado: 'bg-purple-100 text-purple-700',
      conversao: 'bg-green-100 text-green-700',
      perdido: 'bg-red-100 text-red-700'
    };
    return colors[status];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-sm text-gray-600">Gerencie todos os contatos capturados pelo agente IA</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            AD
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard label="Total" value={stats.total} color="bg-gray-100 text-gray-700" />
              <StatCard label="Novos" value={stats.novo} color="bg-blue-100 text-blue-700" />
              <StatCard label="Em Contato" value={stats.contato} color="bg-yellow-100 text-yellow-700" />
              <StatCard label="Qualificados" value={stats.qualificado} color="bg-purple-100 text-purple-700" />
              <StatCard label="Conversão" value={stats.conversao} color="bg-green-100 text-green-700" />
              <StatCard label="Perdidos" value={stats.perdido} color="bg-red-100 text-red-700" />
            </div>

            {/* Filtros e Ações */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between flex-wrap">
                <div className="flex gap-2 flex-1 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="Buscar por nome ou email..." 
                    value={buscaTexto}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setBuscaTexto(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <select 
                  value={filtroStatus}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFiltroStatus(e.target.value as StatusFilter)}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="novo">Novo</option>
                  <option value="contato">Em Contato</option>
                  <option value="qualificado">Qualificado</option>
                  <option value="conversao">Conversão</option>
                  <option value="perdido">Perdido</option>
                </select>

                <button 
                  onClick={exportarCSV}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  <Download size={18} /> Exportar
                </button>

                <button 
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  + Novo Lead
                </button>
              </div>
            </div>

            {/* Formulário Novo Lead */}
            {mostrarFormulario && (
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Adicionar Novo Lead</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nome *</label>
                    <input 
                      type="text"
                      placeholder="Nome completo"
                      value={novoLead.nome}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNovoLead({...novoLead, nome: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                    <input 
                      type="email"
                      placeholder="email@example.com"
                      value={novoLead.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNovoLead({...novoLead, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Telefone *</label>
                    <input 
                      type="tel"
                      placeholder="(11) 99999-0000"
                      value={novoLead.telefone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNovoLead({...novoLead, telefone: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Origem</label>
                    <select 
                      value={novoLead.origem}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setNovoLead({...novoLead, origem: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option value="Site">Site</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Indicação">Indicação</option>
                      <option value="Ligação">Ligação</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={adicionarLead}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Salvar Lead
                  </button>
                  <button 
                    onClick={() => setMostrarFormulario(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Tabela de Leads */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="p-3 text-left font-bold text-gray-900">#</th>
                    <th className="p-3 text-left font-bold text-gray-900">Nome</th>
                    <th className="p-3 text-left font-bold text-gray-900">Email</th>
                    <th className="p-3 text-left font-bold text-gray-900">Telefone</th>
                    <th className="p-3 text-left font-bold text-gray-900">Status</th>
                    <th className="p-3 text-left font-bold text-gray-900">Data</th>
                    <th className="p-3 text-left font-bold text-gray-900">Origem</th>
                    <th className="p-3 text-left font-bold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsFiltrados.length > 0 ? (
                    leadsFiltrados.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3 text-gray-900 font-semibold">{lead.id}</td>
                        <td className="p-3 text-gray-900 font-medium">{lead.nome}</td>
                        <td className="p-3 text-gray-700">{lead.email}</td>
                        <td className="p-3 text-gray-700">{lead.telefone}</td>
                        <td className="p-3">
                          <select 
                            value={lead.status}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => atualizarStatus(lead.id, e.target.value as Lead['status'])}
                            className={`${getStatusColor(lead.status)} px-3 py-1 rounded-full font-semibold text-sm border-0 cursor-pointer focus:outline-none`}
                          >
                            <option value="novo">Novo</option>
                            <option value="contato">Em Contato</option>
                            <option value="qualificado">Qualificado</option>
                            <option value="conversao">Conversão</option>
                            <option value="perdido">Perdido</option>
                          </select>
                        </td>
                        <td className="p-3 text-gray-700 text-sm">{lead.data}</td>
                        <td className="p-3 text-gray-700 text-sm">{lead.origem}</td>
                        <td className="p-3 flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-sm">
                            Contatar
                          </button>
                          <button 
                            onClick={() => deletarLead(lead.id)}
                            className="text-red-600 hover:text-red-800 hover:underline"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-gray-500 font-semibold">
                        Nenhum lead encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Informação de Resultados */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-gray-700 font-semibold">
                Mostrando <span className="text-blue-600 font-bold">{leadsFiltrados.length}</span> de <span className="text-blue-600 font-bold">{leads.length}</span> leads
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className={`${color} p-3 rounded-lg shadow-md text-center`}>
      <p className="text-xs font-semibold opacity-80">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
} 