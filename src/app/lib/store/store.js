// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import subjectReducer from './slices/subjectSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['subject'] 
};

const persistedReducer = persistReducer(persistConfig, subjectReducer);

export const store = configureStore({
  reducer: {
    subject: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);