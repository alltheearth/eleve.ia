// src/components/Information/index.tsx - Usando RTK Query
import { useEffect, useState, type ChangeEvent } from 'react';
import { 
  useGetSchoolsQuery, 
  useUpdateSchoolMutation,
} from '../../services/schoolApi';

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


interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Information() {
  // ✅ USAR RTK QUERY ao invés de AsyncThunk
  const { data: schoolsData, isLoading, error, refetch } = useGetSchoolsQuery();
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

  const [abaSelecionada, setAbaSelecionada] = useState<string>('dados');
  const [escolaAtualId, setEscolaAtualId] = useState<number | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('');
  const [mensagemErro, setMensagemErro] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    nomeEscola: '',
    cnpj: '',
    telefone: '',
    email: '',
    website: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: '',
    complemento: '',
    sobre: '',
    niveisEnsino: {
      infantil: false,
      fundamentoI: false,
      fundamentoII: false,
      medio: false,
    }
  });

  // ✅ CARREGAR DADOS DA ESCOLA QUANDO DISPONÍVEL
  useEffect(() => {
    if (schoolsData && schoolsData.results.length > 0) {
      const escola = schoolsData.results[0]; // Pega primeira escola
      setEscolaAtualId(escola.id);
      
      setFormData({
        nomeEscola: escola.nome_escola || '',
        cnpj: escola.cnpj || '',
        telefone: escola.telefone || '',
        email: escola.email || '',
        website: escola.website || '',
        cep: escola.cep || '',
        endereco: escola.endereco || '',
        cidade: escola.cidade || '',
        estado: escola.estado || '',
        complemento: escola.complemento || '',
        sobre: escola.sobre || '',
        niveisEnsino: {
          infantil: escola.niveis_ensino?.niveis_ensino?.infantil || false,
          fundamentoI: escola.niveis_ensino?.niveis_ensino?.fundamentoI || false,
          fundamentoII: escola.niveis_ensino?.niveis_ensino?.fundamentoII || false,
          medio: escola.niveis_ensino?.niveis_ensino?.medio || false,
        }
      });

      console.log('✅ Dados da escola carregados:', escola);
    }
  }, [schoolsData]);


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

  // ✅ SALVAR ALTERAÇÕES USANDO RTK QUERY MUTATION
  const handleSalvarAlteracoes = async (): Promise<void> => {
    if (!escolaAtualId) {
      setMensagemErro('Nenhuma escola selecionada');
      return;
    }

    try {
      await updateSchool({
        id: escolaAtualId,
        data: {
          nome_escola: formData.nomeEscola,
          cnpj: formData.cnpj,
          telefone: formData.telefone,
          email: formData.email,
          website: formData.website,
          cep: formData.cep,
          endereco: formData.endereco,
          cidade: formData.cidade,
          estado: formData.estado,
          complemento: formData.complemento,
          sobre: formData.sobre,
          niveis_ensino: {
            niveis_ensino: formData.niveisEnsino
          }
        }
      }).unwrap();

      setMensagemSucesso('✅ Dados salvos com sucesso!');
      setMensagemErro('');
      
      setTimeout(() => setMensagemSucesso(''), 3000);
    } catch (err: any) {
      setMensagemErro(`❌ Erro ao salvar: ${err.data?.detail || err.message || 'Erro desconhecido'}`);
      setMensagemSucesso('');
    }
  };



  const handleContatoChange = (field: keyof Contatos, value: string): void => {
    setContatos(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ✅ LOADING E ERROR STATES
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-semibold">Carregando dados da escola...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <p className="font-bold">❌ Erro ao carregar dados</p>
          <p className="text-sm mt-2">Não foi possível carregar os dados da escola.</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!schoolsData || schoolsData.results.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg max-w-md text-center">
          <p className="font-bold">⚠️ Nenhuma escola cadastrada</p>
          <p className="text-sm mt-2">Você ainda não cadastrou nenhuma escola.</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Cadastrar Escola
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Informações da Escola</h1>
            <p className="text-sm text-gray-600">
              {formData.nomeEscola || 'Gerencie todos os dados da sua instituição'}
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            AD
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Mensagens */}
            {mensagemSucesso && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {mensagemSucesso}
              </div>
            )}
            
            {mensagemErro && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {mensagemErro}
              </div>
            )}

            {/* Abas */}
            <div className="flex gap-2 bg-white p-2 rounded-lg shadow-md flex-wrap">
              {[
                { id: 'dados', label: 'Dados Básicos' },
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

                <button 
                  onClick={handleSalvarAlteracoes}
                  disabled={isUpdating}
                  className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
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