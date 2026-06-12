import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import {
  addPipeline,
  editPipeline,
  loadPipelines,
  selectPipeline,
  selectPipelines,
  selectPipelinesStatus,
  selectPipelinesError,
  selectSelectedPipeline,
} from '../features/pipelines/pipelinesSlice.ts';
import { selectCurrentProjectId } from '../features/context/contextSlice.ts';
import EntityPanel from '../components/EntityPanel.tsx';

export default function PipelinesPage() {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(selectCurrentProjectId);
  const pipelines = useAppSelector(selectPipelines);
  const status = useAppSelector(selectPipelinesStatus);
  const error = useAppSelector(selectPipelinesError);
  const selected = useAppSelector(selectSelectedPipeline);

  useEffect(() => {
    if (projectId) {
      dispatch(loadPipelines(projectId));
    }
  }, [dispatch, projectId]);

  return (
    <EntityPanel
      title="Pipelines"
      singular="pipeline"
      items={pipelines}
      status={status}
      error={error}
      selectedId={selected?.id}
      onSelect={(id) => dispatch(selectPipeline(id))}
      onCreate={async (v) => {
        await dispatch(addPipeline({ projectId: projectId!, ...v })).unwrap();
      }}
      onUpdate={async (id, v) => {
        await dispatch(editPipeline({ id, ...v })).unwrap();
      }}
      blockedHint={projectId ? undefined : 'Create a project first.'}
    />
  );
}
