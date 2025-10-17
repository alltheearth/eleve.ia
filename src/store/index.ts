import { configureStore } from "@reduxjs/toolkit";
import ModuleActiveSlice from "../Feature/ModuleActiveSlice";

const store = configureStore({
    reducer: {
        moduleActive: ModuleActiveSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;