import type { JSX } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  bgColor: string;
  textColor: string;
}

interface AlertBoxProps {
  type: 'warning' | 'success' | 'info';
  icon: string;
  text: string;
}

export default function Dashboard(): JSX.Element {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Bem-vindo de volta ao Eleve.ia</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-semibold text-sm">Agente Ativo</span>
            </div>
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard 
                title="Status do Agente" 
                value="Ativo" 
                icon="✅"
                bgColor="bg-green-100"
                textColor="text-green-700"
              />
              <KPICard 
                title="Interações Hoje" 
                value="234" 
                icon="📞"
                bgColor="bg-blue-100"
                textColor="text-blue-700"
              />
              <KPICard 
                title="Documentos Upload" 
                value="8" 
                icon="📋"
                bgColor="bg-purple-100"
                textColor="text-purple-700"
              />
              <KPICard 
                title="FAQs Criadas" 
                value="45" 
                icon="❓"
                bgColor="bg-orange-100"
                textColor="text-orange-700"
              />
            </div>

            {/* Gráfico e Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Gráfico de Atividade */}
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Atividade (Últimos 7 dias)</h2>
                <div className="flex items-end justify-around h-64 gap-2 px-2">
                  {[45, 52, 48, 65, 58, 72, 68].map((val, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition"
                        style={{height: `${(val / 72) * 200}px`}}
                      ></div>
                      <span className="text-xs text-gray-500 font-medium">Dia {i+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo Rápido */}
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo Rápido</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Leads Capturados</span>
                      <span className="text-2xl font-bold text-blue-600">132</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Taxa Resolução</span>
                      <span className="text-2xl font-bold text-green-600">89%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Novos Hoje</span>
                      <span className="text-2xl font-bold text-orange-600">12</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                  Ver Todos os Leads
                </button>
              </div>
            </div>

            {/* Alertas */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Alertas & Notificações</h2>
              <div className="space-y-3">
                <AlertBox type="warning" icon="⚠️" text="2 documentos não processados" />
                <AlertBox type="success" icon="✨" text="Nova FAQ criada com sucesso" />
                <AlertBox type="info" icon="👤" text="Novo lead capturado: João Silva" />
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                  <span>+</span> Novo Documento
                </button>
                <button className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold">
                  <span>+</span> Nova FAQ
                </button>
                <button className="flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold">
                  <span>+</span> Ver Leads
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  icon,
  bgColor,
  textColor
}: KPICardProps): JSX.Element {
  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg shadow-md hover:shadow-lg transition`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm opacity-80 font-medium">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function AlertBox({
  type,
  icon,
  text
}: AlertBoxProps): JSX.Element {
  const styles: Record<AlertBoxProps['type'], string> = {
    warning: 'bg-yellow-50 border-l-4 border-yellow-400',
    success: 'bg-green-50 border-l-4 border-green-400',
    info: 'bg-blue-50 border-l-4 border-blue-400'
  };

  const textColors: Record<AlertBoxProps['type'], string> = {
    warning: 'text-yellow-700',
    success: 'text-green-700',
    info: 'text-blue-700'
  };

  return (
    <div className={`${styles[type]} p-4 rounded flex items-center gap-3`}>
      <span className="text-lg">{icon}</span>
      <span className={`${textColors[type]} font-medium`}>{text}</span>
    </div>
  );
}