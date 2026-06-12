import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store.ts';
import type { Repo } from './types.ts';
import { createRepo, fetchRepos, updateRepo } from './reposApi.ts';

type ReposState = {
  items: Repo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  selectedId?: string;
  requestedId?: string;
};

const initialState: ReposState = {
  items: [],
  status: 'idle',
};

export const loadRepos = createAsyncThunk('repos/fetch', fetchRepos);

export const addRepo = createAsyncThunk(
  'repos/add',
  ({ projectId, ...body }: { projectId: string; name: string; description: string }) =>
    createRepo(projectId, body),
);

export const editRepo = createAsyncThunk(
  'repos/edit',
  ({ id, ...body }: { id: string; name: string; description: string }) =>
    updateRepo(id, body),
);

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    selectRepo: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRepos.pending, (state, action) => {
        state.requestedId = action.meta.arg;
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadRepos.fulfilled, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadRepos.rejected, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addRepo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editRepo.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { selectRepo } = reposSlice.actions;

export const selectRepos = (state: RootState) => state.repos.items;
export const selectReposStatus = (state: RootState) => state.repos.status;
export const selectReposError = (state: RootState) => state.repos.error;
export const selectSelectedRepo = (state: RootState) =>
  state.repos.items.find((r) => r.id === state.repos.selectedId);

export default reposSlice.reducer;
