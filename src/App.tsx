// ✅ CORRETO - src/App.tsx com Header
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/Dashboard';
import Information from './components/Information';
import Login from './components/Auth/Login';
import { authService } from './services/authService';
import Faqs from './components/Faqs';
import Calendar from './components/Calendar';
import Leads from './components/Leads';
import Contacts from './components/Contacts';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const activeModule = useSelector((state: RootState) => state.moduleActive.activeModule);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Verificar autenticação ao carregar
  useEffect(() => {
    if (!isAuthenticated && authService.isAuthenticated()) {
      // Se o token existe mas Redux não sabe, sincronizar
    } else if (!isAuthenticated && !authService.isAuthenticated()) {
      // Não autenticado, mostrar login
      dispatch({ type: 'moduleActive/setActiveModule', payload: 'login' });
    }
  }, [isAuthenticated, dispatch]);

  // Se não autenticado, sempre mostrar login
  if (!isAuthenticated && !authService.isAuthenticated()) {
    return <Login />;
  }

  // Layout com sidebar + header + conteúdo
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ Header agora está aqui, fora do switch */}
        <Header />
        
        {/* Main Content - SEM headers internos */}
        <main className="flex-1 overflow-auto">
          {(() => {
            switch (activeModule) {
              case 'dashboard':
                return <Dashboard />;
              case 'information':
                return <Information />;
              case 'faqs':
                return <Faqs />;
              case 'calendar':
                return <Calendar />;
              case 'leads':
                return <Leads />;
              case 'contatos':
                return <Contacts />;
              default:
                return <Dashboard />;
            }
          })()}
        </main>
      </div>
    </div>
  );
}

export default App;