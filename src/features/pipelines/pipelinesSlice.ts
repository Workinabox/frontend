import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store.ts';
import type { Pipeline } from './types.ts';
import { createPipeline, fetchPipelines, updatePipeline } from './pipelinesApi.ts';

type PipelinesState = {
  items: Pipeline[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  selectedId?: string;
  requestedId?: string;
};

const initialState: PipelinesState = {
  items: [],
  status: 'idle',
};

export const loadPipelines = createAsyncThunk('pipelines/fetch', fetchPipelines);

export const addPipeline = createAsyncThunk(
  'pipelines/add',
  ({ projectId, ...body }: { projectId: string; name: string; description: string }) =>
    createPipeline(projectId, body),
);

export const editPipeline = createAsyncThunk(
  'pipelines/edit',
  ({ id, ...body }: { id: string; name: string; description: string }) =>
    updatePipeline(id, body),
);

const pipelinesSlice = createSlice({
  name: 'pipelines',
  initialState,
  reducers: {
    selectPipeline: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPipelines.pending, (state, action) => {
        state.requestedId = action.meta.arg;
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadPipelines.fulfilled, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadPipelines.rejected, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addPipeline.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editPipeline.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { selectPipeline } = pipelinesSlice.actions;

export const selectPipelines = (state: RootState) => state.pipelines.items;
export const selectPipelinesStatus = (state: RootState) => state.pipelines.status;
export const selectPipelinesError = (state: RootState) => state.pipelines.error;
export const selectSelectedPipeline = (state: RootState) =>
  state.pipelines.items.find((p) => p.id === state.pipelines.selectedId);

export default pipelinesSlice.reducer;
