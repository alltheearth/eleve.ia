// src/Feature/EscolaSlice/index.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = 'http://localhost:8000/api';

interface NiveisEnsino {
  infantil?: boolean;
  fundamentoI?: boolean;
  fundamentoII?: boolean;
  medio?: boolean;
}

interface School {
  id: number;
  usuario_id: number;
  usuario_username: string;
  nome_escola: string;
  cnpj: string;
  telefone: string;
  email: string;
  website: string;
  logo: string | null;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
  complemento: string;
  sobre: string;
  niveis_ensino: {
    niveis_ensino: NiveisEnsino | null;
  };
  criado_em: string;
  atualizado_em: string;
}

interface SchoolResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: School[];
}

interface SchoolState {
  escolas: School[];
  escolaAtual: School | null;
  loading: boolean;
  error: string | null;
  count: number;
  next: string | null;
  previous: string | null;
}

const initialState: SchoolState = {
  escolas: [],
  escolaAtual: null,
  loading: false,
  error: null,
  count: 0,
  next: null,
  previous: null,
};

// Helper para obter o token
const getAuthToken = () => {
  return localStorage.getItem('eleve_token');
};

// Helper para criar config com autenticação
const getAuthConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// ============================================
// THUNKS
// ============================================

// Buscar todas as escolas do usuário
export const fetchSchools = createAsyncThunk(
  'school/fetchSchools',
  async (_, { rejectWithValue }) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get<SchoolResponse>(
        `${API_URL}/escolas/`,
        config
      );
      console.log('✅ Escolas fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar escolas:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        'Erro ao buscar escolas'
      );
    }
  }
);

// Buscar uma escola específica por ID
export const fetchSchoolById = createAsyncThunk(
  'school/fetchSchoolById',
  async (id: number, { rejectWithValue }) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get<School>(
        `${API_URL}/escolas/${id}/`,
        config
      );
      console.log('✅ Escola fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar escola:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.detail || 
        'Erro ao buscar escola'
      );
    }
  }
);

// Criar nova escola
export const createSchool = createAsyncThunk(
  'school/createSchool',
  async (escolaData: Partial<|School>, { rejectWithValue }) => {
    try {
      const config = getAuthConfig();
      const response = await axios.post<School>(
        `${API_URL}/escolas/`,
        escolaData,
        config
      );
      console.log('✅ Escola criada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar escola:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.detail || 
        'Erro ao criar escola'
      );
    }
  }
);

// Atualizar escola
export const updateSchool = createAsyncThunk(
  'school/updateSchool',
  async ({ id, data }: { id: number; data: Partial<School> }, { rejectWithValue }) => {
    try {
      const config = getAuthConfig();
      const response = await axios.patch<School>(
        `${API_URL}/escolas/${id}/`,
        data,
        config
      );
      console.log('✅ Escola atualizada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar escola:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.detail || 
        'Erro ao atualizar escola'
      );
    }
  }
);

// Deletar escola
export const deleteEscola = createAsyncThunk(
  'school/deleteSchool',
  async (id: number, { rejectWithValue }) => {
    try {
      const config = getAuthConfig();
      await axios.delete(`${API_URL}/escolas/${id}/`, config);
      console.log('✅ Escola deletada');
      return id;
    } catch (error: any) {
      console.error('❌ Erro ao deletar escola:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.detail || 
        'Erro ao deletar escola'
      );
    }
  }
);

// ============================================
// SLICE
// ============================================

const SchoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setEscolaAtual: (state, action) => {
      state.escolaAtual = action.payload;
    },
    clearEscolaAtual: (state) => {
      state.escolaAtual = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Escolas
    builder.addCase(fetchSchools.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSchools.fulfilled, (state, action) => {
      state.loading = false;
      state.escolas = action.payload.results;
      state.count = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
      
      // Se só tem uma escola, definir como atual
      if (action.payload.results.length === 1) {
        state.escolaAtual = action.payload.results[0];
      }
    });
    builder.addCase(fetchSchools.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Escola By ID
    builder.addCase(fetchSchoolById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSchoolById.fulfilled, (state, action) => {
      state.loading = false;
      state.escolaAtual = action.payload;
      
      // Atualizar na lista se já existir
      const index = state.escolas.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.escolas[index] = action.payload;
      }
    });
    builder.addCase(fetchSchoolById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Escola
    builder.addCase(createSchool.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSchool.fulfilled, (state, action) => {
      state.loading = false;
      state.escolas.push(action.payload);
      state.escolaAtual = action.payload;
      state.count += 1;
    });
    builder.addCase(createSchool.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Escola
    builder.addCase(updateSchool.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateSchool.fulfilled, (state, action) => {
      state.loading = false;
      
      // Atualizar na lista
      const index = state.escolas.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.escolas[index] = action.payload;
      }
      
      // Atualizar escola atual se for a mesma
      if (state.escolaAtual?.id === action.payload.id) {
        state.escolaAtual = action.payload;
      }
    });
    builder.addCase(updateSchool.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Escola
    builder.addCase(deleteEscola.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteEscola.fulfilled, (state, action) => {
      state.loading = false;
      state.escolas = state.escolas.filter(e => e.id !== action.payload);
      state.count -= 1;
      
      // Limpar escola atual se for a mesma
      if (state.escolaAtual?.id === action.payload) {
        state.escolaAtual = null;
      }
    });
    builder.addCase(deleteEscola.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setEscolaAtual, clearEscolaAtual } = SchoolSlice.actions;
export default SchoolSlice.reducer;

// Seletores úteis
export const selectSchools = (state: { escola: SchoolState }) => state.escola.escolas;
export const selectSchoolAtual = (state: { escola: SchoolState }) => state.escola.escolaAtual;
export const selectSchoolLoading = (state: { escola: SchoolState }) => state.escola.loading;
export const selectSchoolError = (state: { escola: SchoolState }) => state.escola.error;