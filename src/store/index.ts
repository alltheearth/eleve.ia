// Atualizar src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import ModuleActiveSlice from "../Feature/ModuleActiveSlice";
import AuthSlice from "../Feature/AuthSlice";

const store = configureStore({
    reducer: {
        moduleActive: ModuleActiveSlice,
        auth: AuthSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;