import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { contatoService, type Contato } from '../../api/services/contatoService';

interface ContatoState {
  contatos: Contato[];
  currentContato: Contato | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContatoState = {
  contatos: [],
  currentContato: null,
  isLoading: false,
  error: null,
};

export const fetchContatos = createAsyncThunk(
  'contatos/fetchAll',
  async (params?: { status?: string; origem?: string; search?: string }) => {
    return await contatoService.list(params);
  }
);

export const createContato = createAsyncThunk(
  'contatos/create',
  async (data: any) => {
    return await contatoService.create(data);
  }
);

export const updateContato = createAsyncThunk(
  'contatos/update',
  async ({ id, data }: { id: number; data: any }) => {
    return await contatoService.update(id, data);
  }
);

export const deleteContato = createAsyncThunk(
  'contatos/delete',
  async (id: number) => {
    await contatoService.delete(id);
    return id;
  }
);

const contatoSlice = createSlice({
  name: 'contatos',
  initialState,
  reducers: {
    clearCurrentContato: (state) => {
      state.currentContato = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContatos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchContatos.fulfilled, (state, action: PayloadAction<Contato[]>) => {
        state.isLoading = false;
        state.contatos = action.payload;
      })
      .addCase(fetchContatos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erro ao buscar contatos';
      })
      .addCase(createContato.fulfilled, (state, action: PayloadAction<Contato>) => {
        state.contatos.unshift(action.payload);
      })
      .addCase(updateContato.fulfilled, (state, action: PayloadAction<Contato>) => {
        const index = state.contatos.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.contatos[index] = action.payload;
        }
      })
      .addCase(deleteContato.fulfilled, (state, action: PayloadAction<number>) => {
        state.contatos = state.contatos.filter(c => c.id !== action.payload);
      });
  },
});

export const { clearCurrentContato } = contatoSlice.actions;
export default contatoSlice.reducer;