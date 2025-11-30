import { createSlice } from "@reduxjs/toolkit";

interface ModuleActiveState {
    activeModule: string;
}

const initialState: ModuleActiveState = {
    activeModule: 'dashboard',
};

const ModuleActiveSlice = createSlice({
    name: 'moduleActive',
    initialState,
    reducers: {
        setActiveModule: (state, action) => {
            state.activeModule = action.payload;
        },
    },
});

export const { setActiveModule } = ModuleActiveSlice.actions;
export default ModuleActiveSlice.reducer;
