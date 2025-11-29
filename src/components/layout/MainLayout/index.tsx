
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      
      <main className="ml-64 flex-1 bg-gray-50 min-h-screen">
        <Header />
        
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;