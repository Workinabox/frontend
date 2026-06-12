import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import {
  addOrg,
  addProject,
  editOrg,
  editProject,
  loadContext,
  selectCurrentOrg,
  selectCurrentOrgId,
  selectCurrentProject,
  selectCurrentProjectId,
  selectOrgs,
  selectProjects,
  setCurrentProject,
  switchOrg,
} from '../features/context/contextSlice.ts';
import EntityFormModal from './EntityFormModal.tsx';

const MODAL_TITLES = {
  'new-org': 'New organization',
  'edit-org': 'Edit organization',
  'new-project': 'New project',
  'edit-project': 'Edit project',
};

// Sidebar org/project switcher: sets the current context for every panel.
export default function ContextSwitcher() {
  const dispatch = useAppDispatch();
  const orgs = useAppSelector(selectOrgs);
  const projects = useAppSelector(selectProjects);
  const currentOrgId = useAppSelector(selectCurrentOrgId);
  const currentProjectId = useAppSelector(selectCurrentProjectId);
  const currentOrg = useAppSelector(selectCurrentOrg);
  const currentProject = useAppSelector(selectCurrentProject);
  const [modal, setModal] = useState<
    null | 'new-org' | 'edit-org' | 'new-project' | 'edit-project'
  >(null);

  useEffect(() => {
    dispatch(loadContext());
  }, [dispatch]);

  const handleSubmit = async (values: { name: string; description: string }) => {
    try {
      if (modal === 'new-org') {
        await dispatch(addOrg(values)).unwrap();
      } else if (modal === 'edit-org') {
        await dispatch(editOrg({ id: currentOrgId!, ...values })).unwrap();
      } else if (modal === 'new-project') {
        await dispatch(addProject({ orgId: currentOrgId!, ...values })).unwrap();
      } else if (modal === 'edit-project') {
        await dispatch(editProject({ id: currentProjectId!, ...values })).unwrap();
      }
      setModal(null);
    } catch {
      // keep the modal open so the input is not lost
    }
  };

  return (
    <div className="ctx-switch">
      <div className="row">
        <span className="lbl">Org</span>
        <button
          type="button"
          className="ctx-btn"
          title="New organization"
          onClick={() => setModal('new-org')}
        >
          +
        </button>
        <button
          type="button"
          className="ctx-btn"
          title="Edit organization"
          disabled={!currentOrg}
          onClick={() => setModal('edit-org')}
        >
          ✎
        </button>
      </div>
      <select value={currentOrgId ?? ''} onChange={(e) => dispatch(switchOrg(e.target.value))}>
        {orgs.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      <div className="row">
        <span className="lbl">Project</span>
        <button
          type="button"
          className="ctx-btn"
          title="New project"
          disabled={!currentOrgId}
          onClick={() => setModal('new-project')}
        >
          +
        </button>
        <button
          type="button"
          className="ctx-btn"
          title="Edit project"
          disabled={!currentProject}
          onClick={() => setModal('edit-project')}
        >
          ✎
        </button>
      </div>
      {projects.length === 0 ? (
        <select disabled>
          <option>No projects</option>
        </select>
      ) : (
        <select
          value={currentProjectId ?? ''}
          onChange={(e) => dispatch(setCurrentProject(e.target.value))}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}
      {modal !== null && (
        <EntityFormModal
          title={MODAL_TITLES[modal]}
          initial={
            modal === 'edit-org'
              ? currentOrg
              : modal === 'edit-project'
                ? currentProject
                : undefined
          }
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
