// src/utils/validators.ts
export interface ValidationError {
  field: string;
  message: string;
}

export const validators = {
  email: (email: string): string | null => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email é obrigatório';
    if (!regex.test(email)) return 'Email inválido';
    return null;
  },

  senha: (senha: string): string | null => {
    if (!senha) return 'Senha é obrigatória';
    if (senha.length < 8) return 'Mínimo 8 caracteres';
    if (!/[A-Z]/.test(senha)) return 'Deve conter letra maiúscula';
    if (!/[0-9]/.test(senha)) return 'Deve conter número';
    return null;
  },

  cnpj: (cnpj: string): string | null => {
    const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (cnpj && !regex.test(cnpj)) return 'CNPJ inválido';
    return null;
  },

  telefone: (telefone: string): string | null => {
    const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (telefone && !regex.test(telefone)) return 'Telefone inválido';
    return null;
  },

  nomeCompleto: (nome: string): string | null => {
    if (!nome) return 'Nome é obrigatório';
    if (nome.trim().split(' ').length < 2) return 'Digite nome e sobrenome';
    if (nome.length < 3) return 'Nome muito curto';
    return null;
  },

  nomeEscola: (nome: string): string | null => {
    if (!nome) return 'Nome da escola é obrigatório';
    if (nome.length < 3) return 'Nome muito curto';
    return null;
  },
};

export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: string) => string | null>
): ValidationError[] => {
  return Object.entries(rules)
    .map(([field, validator]) => {
      const error = validator(data[field] || '');
      return error ? { field, message: error } : null;
    })
    .filter(Boolean) as ValidationError[];
};