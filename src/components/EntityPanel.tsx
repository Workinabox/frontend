import { useState } from 'react';
import EntityFormModal from './EntityFormModal.tsx';

type EntityItem = { id: string; name: string; description: string };
type EntityFormValues = { name: string; description: string };

type EntityPanelProps = {
  title: string;
  singular: string;
  items: EntityItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  selectedId?: string;
  onSelect: (id: string) => void;
  onCreate: (values: EntityFormValues) => Promise<void>;
  onUpdate: (id: string, values: EntityFormValues) => Promise<void>;
  blockedHint?: string;
};

// Shared list+detail panel for the {id, name, description} entities
// (boards, repos, pipelines, agents). Presentational: the page wires the store.
export default function EntityPanel({
  title,
  singular,
  items,
  status,
  error,
  selectedId,
  onSelect,
  onCreate,
  onUpdate,
  blockedHint,
}: EntityPanelProps) {
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const selected = blockedHint ? undefined : items.find((i) => i.id === selectedId);
  const capitalSingular = singular.charAt(0).toUpperCase() + singular.slice(1);

  let list;
  if (status === 'loading' || status === 'idle') {
    list = <div className="gui-empty">Loading {singular}s…</div>;
  } else if (status === 'failed') {
    list = (
      <div className="gui-empty">
        Failed to load {singular}s: {error}
      </div>
    );
  } else if (items.length === 0) {
    list = <div className="gui-empty">No {singular}s yet.</div>;
  } else {
    list = (
      <div className="gui-list" style={{ gap: 10 }}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`gui-row${item.id === selectedId ? ' sel' : ''}`}
            style={{ gridTemplateColumns: '92px 1fr' }}
            onClick={() => onSelect(item.id)}
          >
            <span className="rid">{item.id}</span>
            <span>
              <span className="rt">{item.name}</span>
              <div className="rsub">{item.description}</div>
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <main className="gui-main">
        <header className="gui-main-head">
          <h1>{title}</h1>
          <div className="gui-toolbar">
            <button
              type="button"
              className="btn primary small"
              disabled={Boolean(blockedHint)}
              onClick={() => setModal('create')}
            >
              + New {singular}
            </button>
          </div>
        </header>
        {blockedHint ? <div className="gui-empty">{blockedHint}</div> : list}
      </main>
      <aside className="gui-trace">
        {selected ? (
          <>
            <div
              className="th"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span>
                — {capitalSingular} · {selected.id}
              </span>
              <button type="button" className="btn ghost small" onClick={() => setModal('edit')}>
                Edit
              </button>
            </div>
            <div className="detail-kv">
              <div className="kv">
                <span className="k">Name</span>
                <span className="v">{selected.name}</span>
              </div>
            </div>
            <div>
              <div className="th" style={{ border: 'none', padding: '0 0 8px' }}>
                Description
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--ink-soft)',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {selected.description}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="th">— {capitalSingular}</div>
            <div className="gui-empty">Select a {singular} to see its details.</div>
          </>
        )}
      </aside>
      {modal === 'create' && (
        <EntityFormModal
          title={`New ${singular}`}
          onSubmit={async (v) => {
            try {
              await onCreate(v);
              setModal(null);
            } catch {
              // keep the modal open so the input is not lost
            }
          }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'edit' && selected && (
        <EntityFormModal
          title={`Edit ${singular}`}
          initial={{ name: selected.name, description: selected.description }}
          onSubmit={async (v) => {
            try {
              await onUpdate(selected.id, v);
              setModal(null);
            } catch {
              // keep the modal open so the input is not lost
            }
          }}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
