import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice.ts';
import worksReducer from '../features/works/worksSlice.ts';
import statusReducer from '../features/status/statusSlice.ts';
import contextReducer from '../features/context/contextSlice.ts';
import agentsReducer from '../features/agents/agentsSlice.ts';
import boardsReducer from '../features/boards/boardsSlice.ts';
import reposReducer from '../features/repos/reposSlice.ts';
import pipelinesReducer from '../features/pipelines/pipelinesSlice.ts';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    works: worksReducer,
    status: statusReducer,
    context: contextReducer,
    agents: agentsReducer,
    boards: boardsReducer,
    repos: reposReducer,
    pipelines: pipelinesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
