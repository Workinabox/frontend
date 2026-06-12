import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store.ts';
import type { Board } from './types.ts';
import { createBoard, fetchBoards, updateBoard } from './boardsApi.ts';

type BoardsState = {
  items: Board[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  selectedId?: string;
  requestedId?: string;
};

const initialState: BoardsState = {
  items: [],
  status: 'idle',
};

export const loadBoards = createAsyncThunk('boards/fetch', fetchBoards);

export const addBoard = createAsyncThunk(
  'boards/add',
  ({ projectId, ...body }: { projectId: string; name: string; description: string }) =>
    createBoard(projectId, body),
);

export const editBoard = createAsyncThunk(
  'boards/edit',
  ({ id, ...body }: { id: string; name: string; description: string }) =>
    updateBoard(id, body),
);

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    selectBoard: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBoards.pending, (state, action) => {
        state.requestedId = action.meta.arg;
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadBoards.fulfilled, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadBoards.rejected, (state, action) => {
        if (action.meta.arg !== state.requestedId) return;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addBoard.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editBoard.fulfilled, (state, action) => {
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { selectBoard } = boardsSlice.actions;

export const selectBoards = (state: RootState) => state.boards.items;
export const selectBoardsStatus = (state: RootState) => state.boards.status;
export const selectBoardsError = (state: RootState) => state.boards.error;
export const selectSelectedBoard = (state: RootState) =>
  state.boards.items.find((b) => b.id === state.boards.selectedId);

export default boardsSlice.reducer;
