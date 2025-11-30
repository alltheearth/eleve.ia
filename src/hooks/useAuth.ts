import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const isGestor = user?.perfil?.tipo === 'gestor';
  const isOperador = user?.perfil?.tipo === 'operador';
  const isSuperuser = user?.is_superuser || false;

  return {
    user,
    isAuthenticated,
    isLoading,
    isGestor,
    isOperador,
    isSuperuser,
    escolaId: user?.perfil?.escola,
    escolaNome: user?.perfil?.escola_nome,
  };
};
