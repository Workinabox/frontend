import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store.ts';
import type { WorkSnapshot } from './types.ts';
import { fetchWorks } from './worksApi.ts';

type WorksState = {
  items: WorkSnapshot[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  selectedId?: string;
};

const initialState: WorksState = {
  items: [],
  status: 'idle',
};

export const loadWorks = createAsyncThunk('works/fetch', fetchWorks);

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
      .addCase(loadWorks.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadWorks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadWorks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
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
