// src/store/index.ts - ATUALIZADO COM RTK QUERY
import { configureStore } from "@reduxjs/toolkit";
import ModuleActiveSlice from "../Feature/ModuleActiveSlice";
import AuthSlice from "../Feature/AuthSlice";
import { schoolApi } from "../services/schoolApi";
import { faqsApi } from "../services/faqsApi";
import { eventsApi } from "../services/eventsApi";
import { contactsApi } from "../services/contactsApi";
import { leadsApi } from "../services/leadsApi";


const store = configureStore({
    reducer: {
        moduleActive: ModuleActiveSlice,
        auth: AuthSlice,
        [schoolApi.reducerPath]: schoolApi.reducer,
        [faqsApi.reducerPath]: faqsApi.reducer,
        [eventsApi.reducerPath]: eventsApi.reducer,
        [contactsApi.reducerPath]: contactsApi.reducer,
        [leadsApi.reducerPath]: leadsApi.reducer,
    },
    // Middleware necessário para o RTK Query
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            schoolApi.middleware, 
            faqsApi.middleware, 
            eventsApi.middleware,
            contactsApi.middleware,
            leadsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;