import {
  BookOpen,
  Home,
  LogOut,
  Menu,
  X,
  type LucideIcon,
  FileText,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useState, type FC, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import { setActiveModule } from "../../../Feature/ModuleActiveSlice";
import { logout } from "../../../Feature/AuthSlice";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  sidebarOpen: boolean;
  active?: boolean;
  onClick?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const Sidebar: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const activeModule = useSelector(
    (state: RootState) => state.moduleActive.activeModule
  );

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "information", label: "Informações da Escola", icon: BookOpen },
    { id: 'calendar', label: 'Calendário Escolar', icon: Calendar},
    { id: "documentos", label: "Documentos", icon: FileText },
    { id: "faqs", label: "FAQs", icon: MessageSquare },
    { id: "leads", label: "Leads", icon: Users },
    { id: "configuracoes", label: "Configurações", icon: Settings },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const handleNavClick = (moduleId: string): void => {
    dispatch(setActiveModule(moduleId));
  };

  const handleLogout = (): void => {
    // Implementar lógica de logout aqui
    dispatch(logout());
  };

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gray-900 text-white transition-all duration-300 flex flex-col shadow-lg`}
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {sidebarOpen && <span className="font-bold text-xl">🎓 ELEVE.IA</span>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hover:bg-gray-800 p-1 rounded transition"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        {menuItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            sidebarOpen={sidebarOpen}
            active={activeModule === item.id}
            onClick={() => handleNavClick(item.id)}
          />
        ))}
      </nav>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
          aria-label="Logout"
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

// Componente NavItem
const NavItem: FC<NavItemProps> = ({
  icon: Icon,
  label,
  sidebarOpen,
  active = false,
  onClick,
}): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
      }`}
      aria-label={label}
    >
      <Icon size={20} />
      {sidebarOpen && <span className="text-sm">{label}</span>}
    </button>
  );
};