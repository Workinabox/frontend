import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store.ts';
import { fetchHealth } from './statusApi.ts';

type StatusState = {
  online: boolean;
  backendVersion?: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: StatusState = {
  online: false,
  status: 'idle',
};

export const loadHealth = createAsyncThunk('status/health', fetchHealth);

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadHealth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadHealth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.online = true;
        state.backendVersion = action.payload.version;
      })
      .addCase(loadHealth.rejected, (state) => {
        state.status = 'failed';
        state.online = false;
      });
  },
});

export const selectStatusOnline = (state: RootState) => state.status.online;
export const selectBackendVersion = (state: RootState) => state.status.backendVersion;

export default statusSlice.reducer;
