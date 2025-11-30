
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { leadService, type Lead, type LeadStats } from '../../api/services/leadService';

interface LeadState {
  leads: Lead[];
  currentLead: Lead | null;
  stats: LeadStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  leads: [],
  currentLead: null,
  stats: null,
  isLoading: false,
  error: null,
};

// ==========================================
// ASYNC THUNKS
// ==========================================

export const fetchLeads = createAsyncThunk(
  'leads/fetchAll',
  async (params?: { status?: string; origem?: string; search?: string }) => {
    return await leadService.list(params);
  }
);

export const fetchLead = createAsyncThunk(
  'leads/fetchOne',
  async (id: number) => {
    return await leadService.get(id);
  }
);

export const createLead = createAsyncThunk(
  'leads/create',
  async (data: any) => {
    return await leadService.create(data);
  }
);

export const updateLead = createAsyncThunk(
  'leads/update',
  async ({ id, data }: { id: number; data: any }) => {
    return await leadService.update(id, data);
  }
);

export const deleteLead = createAsyncThunk(
  'leads/delete',
  async (id: number) => {
    await leadService.delete(id);
    return id;
  }
);

export const changeLeadStatus = createAsyncThunk(
  'leads/changeStatus',
  async ({ id, status }: { id: number; status: string }) => {
    return await leadService.changeStatus(id, status);
  }
);

export const fetchLeadStats = createAsyncThunk(
  'leads/fetchStats',
  async () => {
    return await leadService.getStats();
  }
);

// ==========================================
// SLICE
// ==========================================

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Leads
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action: PayloadAction<Lead[]>) => {
        state.isLoading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erro ao buscar leads';
      });

    // Fetch Lead
    builder
      .addCase(fetchLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.currentLead = action.payload;
      });

    // Create Lead
    builder
      .addCase(createLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.leads.unshift(action.payload);
      });

    // Update Lead
    builder
      .addCase(updateLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        const index = state.leads.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        if (state.currentLead?.id === action.payload.id) {
          state.currentLead = action.payload;
        }
      });

    // Delete Lead
    builder
      .addCase(deleteLead.fulfilled, (state, action: PayloadAction<number>) => {
        state.leads = state.leads.filter(l => l.id !== action.payload);
      });

    // Change Status
    builder
      .addCase(changeLeadStatus.fulfilled, (state, action: PayloadAction<Lead>) => {
        const index = state.leads.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      });

    // Fetch Stats
    builder
      .addCase(fetchLeadStats.fulfilled, (state, action: PayloadAction<LeadStats>) => {
        state.stats = action.payload;
      });
  },
});

export const { clearCurrentLead, clearError } = leadSlice.actions;
export default leadSlice.reducer;