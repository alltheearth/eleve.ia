
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadReducer from './slices/leadSlice';
import contatoReducer from './slices/contatoSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadReducer,
    contatos: contatoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;