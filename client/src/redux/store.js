import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import meterReducer from './slices/meterSlice';
import readingReducer from './slices/readingSlice';
import billReducer from './slices/billSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    meters: meterReducer,
    readings: readingReducer,
    bills: billReducer,
    payments: paymentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export types for TypeScript (optional)
export const getState = store.getState;
export const dispatch = store.dispatch;
