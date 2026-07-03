import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import {
  activateAgent,
  addAgent,
  deactivateAgent,
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

// VM template names offered when creating/editing an agent. Empty = no VM type.
const VM_TYPE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'base', label: 'base' },
  { value: 'developer', label: 'developer' },
];

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
        await dispatch(
          addAgent({
            orgId: orgId!,
            name: v.name,
            description: v.description,
            vm_type: v.select || null,
          }),
        ).unwrap();
      }}
      onUpdate={async (id, v) => {
        await dispatch(
          editAgent({ id, name: v.name, description: v.description, vm_type: v.select || null }),
        ).unwrap();
      }}
      blockedHint={orgId ? undefined : 'No organization selected.'}
      selectField={{
        label: 'VM type',
        options: VM_TYPE_OPTIONS,
        valueFor: (id) => agents.find((a) => a.id === id)?.vm_type ?? '',
      }}
      detailExtra={(id) => {
        const agent = agents.find((a) => a.id === id);
        if (!agent) return null;
        return (
          <div style={{ marginTop: 12 }}>
            <div className="th" style={{ border: 'none', padding: '0 0 6px' }}>
              VM
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className={`badge ${agent.active ? 'completed' : 'progress'}`}>
                {agent.active ? 'Active' : 'Inactive'}
              </span>
              <span className="rt">{agent.vm_type ?? 'no VM type'}</span>
              {agent.active ? (
                <button
                  type="button"
                  className="btn ghost small"
                  onClick={() => {
                    void dispatch(deactivateAgent(id));
                  }}
                >
                  Deactivate
                </button>
              ) : (
                <button
                  type="button"
                  className="btn ghost small"
                  disabled={!agent.vm_type}
                  onClick={() => {
                    void dispatch(activateAgent(id));
                  }}
                >
                  Activate
                </button>
              )}
            </div>
            {agent.active && agent.guest_ip ? (
              <div className="kv" style={{ marginTop: 8 }}>
                <span className="k">Guest IP</span>
                <span className="v">{agent.guest_ip}</span>
              </div>
            ) : null}
          </div>
        );
      }}
    />
  );
}
