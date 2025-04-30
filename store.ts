import { configureStore } from '@reduxjs/toolkit';
import stepReducer from './features/step/stepSlice';

// Add your reducers here
export const store = configureStore({
  reducer: {
    step: stepReducer,
    // example: counter: counterReducer,
  },
});
console.log('store', store.getState())

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;