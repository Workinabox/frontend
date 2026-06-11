import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice.ts';
import worksReducer from '../features/works/worksSlice.ts';
import statusReducer from '../features/status/statusSlice.ts';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    works: worksReducer,
    status: statusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
