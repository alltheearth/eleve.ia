import { useEffect, useState, type ChangeEvent } from 'react';
import { fetchSchools, selectSchools } from '../../Feature/SchoolSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';

interface FormData {
  nomeEscola: string;
  cnpj: string;
  telefone: string;
  email: string;
  website: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
  complemento: string;
  sobre: string;
  niveisEnsino: {
    infantil: boolean;
    fundamentoI: boolean;
    fundamentoII: boolean;
    medio: boolean;
  };
}

interface CalendarioEvento {
  data: string;
  evento: string;
  tipo: string;
}

interface FAQ {
  id: number;
  pergunta: string;
  categoria: string;
  status: string;
}

interface Contatos {
  emailPrincipal: string;
  telefonePrincipal: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  horarioAula: string;
  diretor: string;
  emailDiretor: string;
  coordenador: string;
  emailCoordenador: string;
}

interface NovoEvento {
  data: string;
  evento: string;
  tipo: string;
}

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}


export default function Information() {
   const dispatch = useDispatch<AppDispatch>();
   
    useEffect(() => {
    dispatch(fetchSchools());
  }, []);

  const [abaSelecionada, setAbaSelecionada] = useState<string>('dados');

  const [formData, setFormData] = useState<FormData>({
    nomeEscola: 'Colégio Exemplo',
    cnpj: '12.345.678/0001-99',
    telefone: '(11) 3000-0000',
    email: 'contato@escola.com.br',
    website: 'www.escola.com.br',
    cep: '01310-100',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    complemento: 'Próximo à estação',
    sobre: 'Colégio com 25 anos de tradição em educação de qualidade...',
    niveisEnsino: {
      infantil: true,
      fundamentoI: true,
      fundamentoII: false,
      medio: false,
    }
  });

  const [calendarioEventos, setCalendarioEventos] = useState<CalendarioEvento[]>([
    { data: '15/02/2024', evento: 'Início do Letivo', tipo: '📌' },
    { data: '07/09/2024', evento: 'Prova Bimestral', tipo: '📝' },
    { data: '20/12/2024', evento: 'Encerramento', tipo: '🎓' }
  ]);

  const [novoEvento, setNovoEvento] = useState<NovoEvento>({ data: '', evento: '', tipo: '📌' });

  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: 1, pergunta: 'Como é feita a admissão?', categoria: 'Admissão', status: 'ativa' },
    { id: 2, pergunta: 'Qual é o valor da mensalidade?', categoria: 'Valores', status: 'ativa' },
    { id: 3, pergunta: 'Qual é o uniforme da escola?', categoria: 'Uniforme', status: 'ativa' }
  ]);


  const [contatos, setContatos] = useState<Contatos>({
    emailPrincipal: 'contato@escola.com.br',
    telefonePrincipal: '(11) 3000-0000',
    whatsapp: '(11) 99999-0000',
    instagram: '@colegioexemplo',
    facebook: 'Colégio Exemplo',
    horarioAula: '07:30 - 17:30',
    diretor: 'José Silva',
    emailDiretor: 'diretor@escola.com.br',
    coordenador: 'Maria Santos',
    emailCoordenador: 'coord@escola.com.br'
  });

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof FormData['niveisEnsino']): void => {
    setFormData(prev => ({
      ...prev,
      niveisEnsino: {
        ...prev.niveisEnsino,
        [field]: !prev.niveisEnsino[field]
      }
    }));
  };

  const adicionarEvento = (): void => {
    if (novoEvento.data && novoEvento.evento) {
      setCalendarioEventos([...calendarioEventos, novoEvento]);
      setNovoEvento({ data: '', evento: '', tipo: '📌' });
    }
  };

  const deletarEvento = (index: number): void => {
    setCalendarioEventos(calendarioEventos.filter((_, i) => i !== index));
  };

  const handleContatoChange = (field: keyof Contatos, value: string): void => {
    setContatos(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Informações da Escola</h1>
            <p className="text-sm text-gray-600">Gerencie todos os dados da sua instituição</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            AD
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Abas */}
            <div className="flex gap-2 bg-white p-2 rounded-lg shadow-md flex-wrap">
              {[
                { id: 'dados', label: 'Dados Básicos' },
                { id: 'calendario', label: 'Calendário Escolar' },
                { id: 'faqs', label: 'FAQs' },
                { id: 'contato', label: 'Contato' }
              ].map(aba => (
                <button
                  key={aba.id}
                  onClick={() => setAbaSelecionada(aba.id)}
                  className={`px-4 py-2 rounded-lg transition font-semibold ${
                    abaSelecionada === aba.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {aba.label}
                </button>
              ))}
            </div>

            {/* TAB 1: DADOS BÁSICOS */}
            {abaSelecionada === 'dados' && (
              <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dados Básicos</h2>

                {/* Identificação */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Identificação</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                      label="Nome da Escola" 
                      value={formData.nomeEscola}
                      onChange={(e) => handleInputChange('nomeEscola', e.target.value)}
                    />
                    <InputField 
                      label="CNPJ" 
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange('cnpj', e.target.value)}
                    />
                    <InputField 
                      label="Telefone" 
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                    />
                    <InputField 
                      label="Email" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    <InputField 
                      label="Website" 
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Logo da Escola</label>
                      <input type="file" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Localização */}
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Localização</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                      label="CEP" 
                      value={formData.cep}
                      onChange={(e) => handleInputChange('cep', e.target.value)}
                    />
                    <InputField 
                      label="Endereço" 
                      value={formData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                    />
                    <InputField 
                      label="Cidade" 
                      value={formData.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                    />
                    <InputField 
                      label="Estado" 
                      value={formData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                    />
                    <div className="md:col-span-2">
                      <InputField 
                        label="Complemento" 
                        value={formData.complemento}
                        onChange={(e) => handleInputChange('complemento', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Sobre a Escola */}
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Sobre a Escola</h3>
                  <label className="block text-gray-700 font-semibold mb-2">História, Missão e Valores</label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    rows={4}
                    value={formData.sobre}
                    onChange={(e) => handleInputChange('sobre', e.target.value)}
                  ></textarea>
                </div>

                {/* Níveis de Ensino */}
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Níveis de Ensino</h3>
                  <div className="space-y-2">
                    {[
                      { key: 'infantil' as const, label: 'Educação Infantil' },
                      { key: 'fundamentoI' as const, label: 'Ensino Fundamental I' },
                      { key: 'fundamentoII' as const, label: 'Ensino Fundamental II' },
                      { key: 'medio' as const, label: 'Ensino Médio' }
                    ].map(nivel => (
                      <label key={nivel.key} className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={formData.niveisEnsino[nivel.key]}
                          onChange={() => handleCheckboxChange(nivel.key)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-gray-700 font-medium">{nivel.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                  Salvar Alterações
                </button>
              </div>
            )}

            {/* TAB 2: CALENDÁRIO */}
            {abaSelecionada === 'calendario' && (
              <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Calendário Escolar 2024</h2>

                {/* Novo Evento */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Adicionar Novo Evento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Data</label>
                      <input 
                        type="date" 
                        value={novoEvento.data}
                        onChange={(e) => setNovoEvento({...novoEvento, data: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Evento</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Prova Bimestral"
                        value={novoEvento.evento}
                        onChange={(e) => setNovoEvento({...novoEvento, evento: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Tipo</label>
                      <select 
                        value={novoEvento.tipo}
                        onChange={(e) => setNovoEvento({...novoEvento, tipo: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      >
                        <option value="📌">📌 Feriado</option>
                        <option value="📝">📝 Prova/Avaliação</option>
                        <option value="🎓">🎓 Formatura</option>
                        <option value="🎉">🎉 Evento Cultural</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={adicionarEvento}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    + Adicionar Evento
                  </button>
                </div>

                {/* Tabela de Eventos */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left font-bold">Data</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Evento</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Tipo</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calendarioEventos.map((evento, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition">
                          <td className="border border-gray-300 p-3">{evento.data}</td>
                          <td className="border border-gray-300 p-3">{evento.evento}</td>
                          <td className="border border-gray-300 p-3">{evento.tipo}</td>
                          <td className="border border-gray-300 p-3 flex gap-2">
                            <button className="text-blue-600 hover:underline font-semibold text-sm">Editar</button>
                            <button 
                              onClick={() => deletarEvento(index)}
                              className="text-red-600 hover:underline font-semibold text-sm"
                            >
                              Deletar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: FAQs */}
            {abaSelecionada === 'faqs' && (
              <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Perguntas Frequentes (FAQs)</h2>

                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="Buscar FAQs..." 
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                  <button onClick={() => setFaqs([])} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                    + Nova FAQ
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left font-bold">#</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Pergunta</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Categoria</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Status</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faqs.map((faq) => (
                        <tr key={faq.id} className="border-b hover:bg-gray-50 transition">
                          <td className="border border-gray-300 p-3">{faq.id}</td>
                          <td className="border border-gray-300 p-3 font-medium">{faq.pergunta}</td>
                          <td className="border border-gray-300 p-3">{faq.categoria}</td>
                          <td className="border border-gray-300 p-3">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">✅ Ativa</span>
                          </td>
                          <td className="border border-gray-300 p-3 flex gap-2">
                            <button className="text-blue-600 hover:underline font-semibold text-sm">Editar</button>
                            <button className="text-red-600 hover:underline font-semibold text-sm">Deletar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: CONTATO */}
            {abaSelecionada === 'contato' && (
              <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Contato e Informações</h2>

                {/* Contatos Principais */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Contatos Principais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                      label="Email Principal" 
                      type="email"
                      value={contatos.emailPrincipal}
                      onChange={(e) => handleContatoChange('emailPrincipal', e.target.value)}
                    />
                    <InputField 
                      label="Telefone Geral" 
                      value={contatos.telefonePrincipal}
                      onChange={(e) => handleContatoChange('telefonePrincipal', e.target.value)}
                    />
                    <InputField 
                      label="WhatsApp" 
                      value={contatos.whatsapp}
                      onChange={(e) => handleContatoChange('whatsapp', e.target.value)}
                    />
                    <InputField 
                      label="Horário de Aula" 
                      value={contatos.horarioAula}
                      onChange={(e) => handleContatoChange('horarioAula', e.target.value)}
                    />
                    <InputField 
                      label="Instagram" 
                      value={contatos.instagram}
                      onChange={(e) => handleContatoChange('instagram', e.target.value)}
                    />
                    <InputField 
                      label="Facebook" 
                      value={contatos.facebook}
                      onChange={(e) => handleContatoChange('facebook', e.target.value)}
                    />
                  </div>
                </div>

                {/* Responsáveis */}
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Responsáveis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                      label="Diretor/Diretora" 
                      value={contatos.diretor}
                      onChange={(e) => handleContatoChange('diretor', e.target.value)}
                    />
                    <InputField 
                      label="Email do Diretor" 
                      type="email"
                      value={contatos.emailDiretor}
                      onChange={(e) => handleContatoChange('emailDiretor', e.target.value)}
                    />
                    <InputField 
                      label="Coordenador Pedagógico" 
                      value={contatos.coordenador}
                      onChange={(e) => handleContatoChange('coordenador', e.target.value)}
                    />
                    <InputField 
                      label="Email do Coordenador" 
                      type="email"
                      value={contatos.emailCoordenador}
                      onChange={(e) => handleContatoChange('emailCoordenador', e.target.value)}
                    />
                  </div>
                </div>

                <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                  Salvar Alterações
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}



function InputField({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
      />
    </div>
  );
}