import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/Dashboard';
import Information from './components/Information';
import { useSelector } from 'react-redux';
import Login from './components/Auth/Login';

const ShepherdsToolkit = () => {
 
  const activeModule = useSelector((state: any) => state.moduleActive.activeModule);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />


      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
          {
            (() => {
              switch(activeModule) {
                case 'login':
                  return <Login />;
                case 'dashboard':
                  return <Dashboard />;
                case 'information':
                  return <Information />;
                default:
                  return <Dashboard />;
              }
            })()
          }
      </main>
    </div>
  );
};

export default ShepherdsToolkit;
