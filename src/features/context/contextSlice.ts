import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store.ts';
import type { Organization, Project } from './types.ts';
import {
  createOrganization,
  createProject,
  fetchOrganizations,
  fetchProjects,
  updateOrganization,
  updateProject,
} from './contextApi.ts';

type ContextState = {
  orgs: Organization[];
  projects: Project[];
  currentOrgId?: string;
  currentProjectId?: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
};

const initialState: ContextState = {
  orgs: [],
  projects: [],
  status: 'idle',
};

export const loadContext = createAsyncThunk('context/load', async () => {
  const orgs = await fetchOrganizations();
  const projects = orgs.length > 0 ? await fetchProjects(orgs[0].id) : [];
  return { orgs, projects };
});

export const switchOrg = createAsyncThunk('context/switchOrg', (orgId: string) =>
  fetchProjects(orgId),
);

export const addOrg = createAsyncThunk(
  'context/addOrg',
  (body: { name: string; description: string }) => createOrganization(body),
);

export const editOrg = createAsyncThunk(
  'context/editOrg',
  ({ id, ...body }: { id: string; name: string; description: string }) =>
    updateOrganization(id, body),
);

export const addProject = createAsyncThunk(
  'context/addProject',
  ({ orgId, ...body }: { orgId: string; name: string; description: string }) =>
    createProject(orgId, body),
);

export const editProject = createAsyncThunk(
  'context/editProject',
  ({ id, ...body }: { id: string; name: string; description: string }) =>
    updateProject(id, body),
);

const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<string>) => {
      state.currentProjectId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadContext.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadContext.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orgs = action.payload.orgs;
        state.projects = action.payload.projects;
        state.currentOrgId = action.payload.orgs[0]?.id;
        state.currentProjectId = action.payload.projects[0]?.id;
      })
      .addCase(loadContext.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(switchOrg.pending, (state, action) => {
        state.currentOrgId = action.meta.arg;
        state.projects = [];
        state.currentProjectId = undefined;
        state.error = undefined;
      })
      .addCase(switchOrg.fulfilled, (state, action) => {
        if (action.meta.arg !== state.currentOrgId) return;
        state.projects = action.payload;
        state.currentProjectId = action.payload[0]?.id;
      })
      .addCase(switchOrg.rejected, (state, action) => {
        if (action.meta.arg !== state.currentOrgId) return;
        state.error = action.error.message;
      })
      .addCase(addOrg.fulfilled, (state, action) => {
        state.orgs.push(action.payload);
        state.currentOrgId = action.payload.id;
        state.projects = [];
        state.currentProjectId = undefined;
      })
      .addCase(editOrg.fulfilled, (state, action) => {
        const index = state.orgs.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orgs[index] = action.payload;
        }
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        state.currentProjectId = action.payload.id;
      })
      .addCase(editProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      });
  },
});

export const { setCurrentProject } = contextSlice.actions;

export const selectOrgs = (state: RootState) => state.context.orgs;
export const selectProjects = (state: RootState) => state.context.projects;
export const selectCurrentOrgId = (state: RootState) => state.context.currentOrgId;
export const selectCurrentProjectId = (state: RootState) => state.context.currentProjectId;
export const selectCurrentOrg = (state: RootState) =>
  state.context.orgs.find((o) => o.id === state.context.currentOrgId);
export const selectCurrentProject = (state: RootState) =>
  state.context.projects.find((p) => p.id === state.context.currentProjectId);
export const selectContextStatus = (state: RootState) => state.context.status;

export default contextSlice.reducer;
