import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store.ts';
import type { Agent } from './types.ts';
import { createAgent, fetchAgents, updateAgent } from './agentsApi.ts';

type AgentsState = {
  items: Agent[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  selectedId?: string;
  requestedId?: string;
};

const initialState: AgentsState = {
  items: [],
  status: 'idle',
};

export const loadAgents = createAsyncThunk('agents/fetch', fetchAgents);

export const addAgent = createAsyncThunk(
  'agents/add',
  ({ orgId, ...body }: { orgId: string; name: string; description: string }) =>
    createAgent(orgId, body),
);

export const editAgent = createAsyncThunk(
  'agents/edit',
  ({ id, ...body }: { id: string; name: string; description: string }) =>
    updateAgent(id, body),
);

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    selectAgent: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAgents.pending, (state, action) => {
        state.requestedId = action.meta.arg;
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadAgents.fulfilled, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadAgents.rejected, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addAgent.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editAgent.fulfilled, (state, action) => {
        const index = state.items.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { selectAgent } = agentsSlice.actions;

export const selectAgents = (state: RootState) => state.agents.items;
export const selectAgentsStatus = (state: RootState) => state.agents.status;
export const selectAgentsError = (state: RootState) => state.agents.error;
export const selectSelectedAgent = (state: RootState) =>
  state.agents.items.find((a) => a.id === state.agents.selectedId);

export default agentsSlice.reducer;
