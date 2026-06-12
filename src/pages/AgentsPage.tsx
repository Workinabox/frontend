import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import {
  addAgent,
  editAgent,
  loadAgents,
  selectAgent,
  selectAgents,
  selectAgentsStatus,
  selectAgentsError,
  selectSelectedAgent,
} from '../features/agents/agentsSlice.ts';
import { selectCurrentOrgId } from '../features/context/contextSlice.ts';
import EntityPanel from '../components/EntityPanel.tsx';

export default function AgentsPage() {
  const dispatch = useAppDispatch();
  const orgId = useAppSelector(selectCurrentOrgId);
  const agents = useAppSelector(selectAgents);
  const status = useAppSelector(selectAgentsStatus);
  const error = useAppSelector(selectAgentsError);
  const selected = useAppSelector(selectSelectedAgent);

  useEffect(() => {
    if (orgId) {
      dispatch(loadAgents(orgId));
    }
  }, [dispatch, orgId]);

  return (
    <EntityPanel
      title="Agents"
      singular="agent"
      items={agents}
      status={status}
      error={error}
      selectedId={selected?.id}
      onSelect={(id) => dispatch(selectAgent(id))}
      onCreate={async (v) => {
        await dispatch(addAgent({ orgId: orgId!, ...v })).unwrap();
      }}
      onUpdate={async (id, v) => {
        await dispatch(editAgent({ id, ...v })).unwrap();
      }}
      blockedHint={orgId ? undefined : 'No organization selected.'}
    />
  );
}
