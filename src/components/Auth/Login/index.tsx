import  { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, ArrowRight, CheckCircle } from 'lucide-react';

export default function Login() {
  const [telaAtual, setTelaAtual] = useState('login');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaConfirm, setMostrarSenhaConfirm] = useState(false);

  // Estado do Login
  const [login, setLogin] = useState({
    email: '',
    senha: '',
    lembrar: false
  });

  // Estado do Registro
  const [registro, setRegistro] = useState({
    nomeCompleto: '',
    nomeEscola: '',
    cnpj: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    termo: false
  });

  const [erroLogin, setErroLogin] = useState('');
  const [erroRegistro, setErroRegistro] = useState('');

  // Handle Login
  const handleLogin = () => {
    setErroLogin('');

    if (!login.email || !login.senha) {
      setErroLogin('Por favor, preencha todos os campos');
      return;
    }

    if (!login.email.includes('@')) {
      setErroLogin('Email inválido');
      return;
    }

    console.log('Login:', login);
    alert('✅ Login realizado com sucesso!');
  };

  // Handle Registro
  const handleRegistro = () => {
    setErroRegistro('');

    if (!registro.nomeCompleto || !registro.nomeEscola || !registro.email || !registro.senha) {
      setErroRegistro('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!registro.email.includes('@')) {
      setErroRegistro('Email inválido');
      return;
    }

    if (registro.senha.length < 8) {
      setErroRegistro('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    if (registro.senha !== registro.confirmarSenha) {
      setErroRegistro('As senhas não conferem');
      return;
    }

    if (!registro.termo) {
      setErroRegistro('Você deve aceitar os termos de uso');
      return;
    }

    console.log('Registro:', registro);
    alert('✅ Conta criada com sucesso! Faça login para continuar.');
    setTelaAtual('login');
  };

  // ========== TELA DE LOGIN ==========
  if (telaAtual === 'login') {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-600 to-blue-900">
        {/* Lado Esquerdo - Informações */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center items-center text-white p-12">
          <div className="max-w-md">
            <div className="text-5xl font-bold mb-6">🎓</div>
            <h1 className="text-4xl font-bold mb-4">ELEVE.IA</h1>
            <p className="text-xl mb-8 opacity-90">
              Transforme sua escola com um agente de IA inteligente
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Responda dúvidas automaticamente 24/7</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Capture leads de interessados</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Melhore a comunicação com pais e alunos</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Integre com seus sistemas</span>
              </div>
            </div>

            <p className="text-sm opacity-75 mt-12">
              Mais de 500 escolas já confiam no Eleve.ia
            </p>
          </div>
        </div>

        {/* Lado Direito - Formulário de Login */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
          <div className="w-full max-w-md">
            {/* Logo Mobile */}
            <div className="lg:hidden text-center mb-8">
              <div className="text-4xl mb-2">🎓</div>
              <h1 className="text-3xl font-bold text-blue-600">ELEVE.IA</h1>
            </div>

            {/* Card de Login */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h2>
              <p className="text-gray-600 mb-8">Faça login para acessar sua conta</p>

              {/* Erro */}
              {erroLogin && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  ❌ {erroLogin}
                </div>
              )}

              {/* Campos */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={login.email}
                      onChange={(e) => setLogin({...login, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={login.senha}
                      onChange={(e) => setLogin({...login, senha: e.target.value})}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={login.lembrar}
                      onChange={(e) => setLogin({...login, lembrar: e.target.checked})}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-gray-700 text-sm">Lembrar-me</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                    Esqueceu a senha?
                  </a>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg flex items-center justify-center gap-2"
                >
                  Entrar <ArrowRight size={20} />
                </button>
              </div>

              {/* Divisor */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm">ou</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Login Social */}
              <div className="space-y-2">
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2">
                  <span>📧</span> Continuar com Google
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2">
                  <span>👤</span> Continuar com Microsoft
                </button>
              </div>

              {/* Registro */}
              <p className="text-center text-gray-600 mt-6">
                Não tem conta?{' '}
                <button
                  onClick={() => setTelaAtual('registro')}
                  className="text-blue-600 hover:text-blue-700 font-bold"
                >
                  Registre-se aqui
                </button>
              </p>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-600 text-xs mt-6">
              Ao fazer login, você concorda com nossos{' '}
              <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a> e{' '}
              <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========== TELA DE REGISTRO ==========
  if (telaAtual === 'registro') {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-600 to-blue-900">
        {/* Lado Esquerdo - Informações */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center items-center text-white p-12">
          <div className="max-w-md">
            <div className="text-5xl font-bold mb-6">🎓</div>
            <h1 className="text-4xl font-bold mb-4">ELEVE.IA</h1>
            <p className="text-xl mb-8 opacity-90">
              Crie sua conta e comece a usar agora
            </p>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-6 space-y-3">
              <h3 className="font-bold text-lg mb-4">Por que escolher Eleve.ia?</h3>
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Sem necessidade de configuração técnica</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Suporte especializado em educação</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Teste gratuito por 14 dias</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0" />
                <span>Cancelamento a qualquer momento</span>
              </div>
            </div>

            <p className="text-sm opacity-75 mt-12">
              ⭐⭐⭐⭐⭐ 4.9 de 5 - 200+ avaliações positivas
            </p>
          </div>
        </div>

        {/* Lado Direito - Formulário de Registro */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 overflow-y-auto">
          <div className="w-full max-w-md my-8">
            {/* Logo Mobile */}
            <div className="lg:hidden text-center mb-8">
              <div className="text-4xl mb-2">🎓</div>
              <h1 className="text-3xl font-bold text-blue-600">ELEVE.IA</h1>
            </div>

            {/* Card de Registro */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Crie sua conta</h2>
              <p className="text-gray-600 mb-8">Teste gratuito por 14 dias</p>

              {/* Erro */}
              {erroRegistro && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  ❌ {erroRegistro}
                </div>
              )}

              {/* Campos */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nome Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={registro.nomeCompleto}
                      onChange={(e) => setRegistro({...registro, nomeCompleto: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nome da Escola *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Colégio/Escola"
                      value={registro.nomeEscola}
                      onChange={(e) => setRegistro({...registro, nomeEscola: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">CNPJ</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={registro.cnpj}
                    onChange={(e) => setRegistro({...registro, cnpj: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={registro.email}
                      onChange={(e) => setRegistro({...registro, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="tel"
                      placeholder="(11) 99999-0000"
                      value={registro.telefone}
                      onChange={(e) => setRegistro({...registro, telefone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Senha *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={registro.senha}
                      onChange={(e) => setRegistro({...registro, senha: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Deve conter pelo menos 8 caracteres</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Confirmar Senha *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={mostrarSenhaConfirm ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={registro.confirmarSenha}
                      onChange={(e) => setRegistro({...registro, confirmarSenha: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={registro.termo}
                    onChange={(e) => setRegistro({...registro, termo: e.target.checked})}
                    className="w-4 h-4 rounded mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-700 text-sm">
                    Concordo com os <a href="#" className="text-blue-600 hover:underline font-semibold">Termos de Uso</a> e <a href="#" className="text-blue-600 hover:underline font-semibold">Política de Privacidade</a> *
                  </span>
                </label>

                <button
                  onClick={handleRegistro}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg"
                >
                  Criar Conta
                </button>
              </div>

              {/* Divisor */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm">ou</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Registro Social */}
              <div className="space-y-2">
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2">
                  <span>📧</span> Registrar com Google
                </button>
              </div>

              {/* Login */}
              <p className="text-center text-gray-600 mt-6">
                Já tem conta?{' '}
                <button
                  onClick={() => setTelaAtual('login')}
                  className="text-blue-600 hover:text-blue-700 font-bold"
                >
                  Faça login aqui
                </button>
              </p>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-600 text-xs mt-6">
              Teste gratuito. Sem cartão de crédito necessário.
            </p>
          </div>
        </div>
      </div>
    );
  }
}