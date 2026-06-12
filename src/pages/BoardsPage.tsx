import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import {
  addBoard,
  editBoard,
  loadBoards,
  selectBoard,
  selectBoards,
  selectBoardsStatus,
  selectBoardsError,
  selectSelectedBoard,
} from '../features/boards/boardsSlice.ts';
import { selectCurrentProjectId } from '../features/context/contextSlice.ts';
import EntityPanel from '../components/EntityPanel.tsx';

export default function BoardsPage() {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(selectCurrentProjectId);
  const boards = useAppSelector(selectBoards);
  const status = useAppSelector(selectBoardsStatus);
  const error = useAppSelector(selectBoardsError);
  const selected = useAppSelector(selectSelectedBoard);

  useEffect(() => {
    if (projectId) {
      dispatch(loadBoards(projectId));
    }
  }, [dispatch, projectId]);

  return (
    <EntityPanel
      title="Boards"
      singular="board"
      items={boards}
      status={status}
      error={error}
      selectedId={selected?.id}
      onSelect={(id) => dispatch(selectBoard(id))}
      onCreate={async (v) => {
        await dispatch(addBoard({ projectId: projectId!, ...v })).unwrap();
      }}
      onUpdate={async (id, v) => {
        await dispatch(editBoard({ id, ...v })).unwrap();
      }}
      blockedHint={projectId ? undefined : 'Create a project first.'}
    />
  );
}
