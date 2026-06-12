import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store.ts';
import type { WorkSnapshot } from './types.ts';
import { createWork, fetchWorks, updateWork } from './worksApi.ts';

type WorksState = {
  items: WorkSnapshot[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  selectedId?: string;
  requestedId?: string;
};

const initialState: WorksState = {
  items: [],
  status: 'idle',
};

export const loadWorks = createAsyncThunk('works/fetch', fetchWorks);

export const addWork = createAsyncThunk(
  'works/add',
  ({ projectId, ...body }: { projectId: string; title: string; description: string }) =>
    createWork(projectId, body),
);

export const editWork = createAsyncThunk(
  'works/edit',
  ({ id, ...body }: { id: string; title: string; description: string }) =>
    updateWork(id, body),
);

const worksSlice = createSlice({
  name: 'works',
  initialState,
  reducers: {
    selectWork: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWorks.pending, (state, action) => {
        state.requestedId = action.meta.arg;
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadWorks.fulfilled, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadWorks.rejected, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addWork.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editWork.fulfilled, (state, action) => {
        const index = state.items.findIndex((w) => w.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { selectWork } = worksSlice.actions;

export const selectWorks = (state: RootState) => state.works.items;
export const selectWorksStatus = (state: RootState) => state.works.status;
export const selectWorksError = (state: RootState) => state.works.error;
export const selectSelectedWork = (state: RootState) =>
  state.works.items.find((w) => w.id === state.works.selectedId);

export default worksSlice.reducer;
