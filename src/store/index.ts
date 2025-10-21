// src/store/index.ts - ATUALIZADO
import { configureStore } from "@reduxjs/toolkit";
import ModuleActiveSlice from "../Feature/ModuleActiveSlice";
import AuthSlice from "../Feature/AuthSlice";
import SchoolSlice from "../Feature/SchoolSlice";

const store = configureStore({
    reducer: {
        moduleActive: ModuleActiveSlice,
        auth: AuthSlice,
        school: SchoolSlice,  // ✅ NOVO: Reducer para gerenciar dados da escola
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;