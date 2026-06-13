import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import {
  addRepo,
  editRepo,
  loadRepos,
  selectRepo,
  selectRepos,
  selectReposStatus,
  selectReposError,
  selectSelectedRepo,
  setVisibility,
} from '../features/repos/reposSlice.ts';
import { selectCurrentProjectId } from '../features/context/contextSlice.ts';
import EntityPanel from '../components/EntityPanel.tsx';

export default function ReposPage() {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(selectCurrentProjectId);
  const repos = useAppSelector(selectRepos);
  const status = useAppSelector(selectReposStatus);
  const error = useAppSelector(selectReposError);
  const selected = useAppSelector(selectSelectedRepo);

  useEffect(() => {
    if (projectId) {
      dispatch(loadRepos(projectId));
    }
  }, [dispatch, projectId]);

  return (
    <EntityPanel
      title="Repos"
      singular="repo"
      items={repos}
      status={status}
      error={error}
      selectedId={selected?.id}
      onSelect={(id) => dispatch(selectRepo(id))}
      onCreate={async (v) => {
        await dispatch(addRepo({ projectId: projectId!, ...v })).unwrap();
      }}
      onUpdate={async (id, v) => {
        await dispatch(editRepo({ id, ...v })).unwrap();
      }}
      blockedHint={projectId ? undefined : 'Create a project first.'}
      detailExtra={(id) => {
        const repo = repos.find((r) => r.id === id);
        if (!repo) return null;
        const next = repo.visibility === 'public' ? 'private' : 'public';
        return (
          <div style={{ marginTop: 12 }}>
            <div className="th" style={{ border: 'none', padding: '0 0 6px' }}>
              Visibility
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="rt">{repo.visibility}</span>
              <button
                type="button"
                className="btn ghost small"
                onClick={() => {
                  void dispatch(setVisibility({ id, visibility: next }));
                }}
              >
                Make {next}
              </button>
            </div>
          </div>
        );
      }}
    />
  );
}
