import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import  { logout } from '../../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../../store'

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">
          Bem-vindo, {user?.first_name || 'Usuário'}!
        </h2>
        <p className="text-sm text-gray-600">
          {user?.perfil?.tipo_display || 'Carregando...'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notificações */}
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
};

export default Header;