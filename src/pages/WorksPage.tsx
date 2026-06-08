import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import {
  loadWorks,
  selectWork,
  selectWorks,
  selectWorksStatus,
  selectWorksError,
  selectSelectedWork,
} from '../features/works/worksSlice.ts';
import type { WorkSnapshot } from '../features/works/types.ts';

function WorkRow({
  work,
  selected,
  onSelect,
}: {
  work: WorkSnapshot;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`gui-row${selected ? ' sel' : ''}`}
      onClick={() => onSelect(work.id)}
    >
      <span className="rid">{work.id}</span>
      <span>
        <span className="rt">{work.title}</span>
        <div className="rsub">{work.description}</div>
      </span>
      <span className={`badge ${work.is_done ? 'completed' : 'progress'}`}>
        {work.is_done ? 'Completed' : 'In progress'}
      </span>
      <span className="rmeta">{work.children.length} works</span>
    </button>
  );
}

function WorksList() {
  const dispatch = useAppDispatch();
  const works = useAppSelector(selectWorks);
  const status = useAppSelector(selectWorksStatus);
  const error = useAppSelector(selectWorksError);
  const selected = useAppSelector(selectSelectedWork);

  if (status === 'loading' || status === 'idle') {
    return <div className="gui-empty">Loading works…</div>;
  }
  if (status === 'failed') {
    return <div className="gui-empty">Failed to load works: {error}</div>;
  }
  if (works.length === 0) {
    return <div className="gui-empty">No works yet.</div>;
  }
  return (
    <div className="gui-list" style={{ gap: 10 }}>
      {works.map((w) => (
        <WorkRow
          key={w.id}
          work={w}
          selected={selected?.id === w.id}
          onSelect={(id) => dispatch(selectWork(id))}
        />
      ))}
    </div>
  );
}

function WorkDetail() {
  const selected = useAppSelector(selectSelectedWork);

  if (!selected) {
    return (
      <aside className="gui-trace">
        <div className="th">— Work</div>
        <div className="gui-empty">Select a work to see its details.</div>
      </aside>
    );
  }
  return (
    <aside className="gui-trace">
      <div className="th">— Work · {selected.id}</div>
      <div className="detail-kv">
        <div className="kv">
          <span className="k">Title</span>
          <span className="v">{selected.title}</span>
        </div>
        <div className="kv">
          <span className="k">Status</span>
          <span className="v">{selected.is_done ? 'Completed' : 'In progress'}</span>
        </div>
        <div className="kv">
          <span className="k">Works</span>
          <span className="v">{selected.children.length}</span>
        </div>
      </div>
      <div>
        <div className="th" style={{ border: 'none', padding: '0 0 8px' }}>
          Objective
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
      {selected.dones.length > 0 && (
        <div>
          <div className="th" style={{ border: 'none', padding: '0 0 8px' }}>
            Acceptance
          </div>
          <div className="detail-kv">
            {selected.dones.map((d) => (
              <div className="kv" key={d.id}>
                <span className="v mono">
                  {d.fulfilled ? '✓' : '·'} {d.criterion}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export default function WorksPage() {
  const dispatch = useAppDispatch();
  const works = useAppSelector(selectWorks);

  useEffect(() => {
    dispatch(loadWorks());
  }, [dispatch]);

  return (
    <>
      <main className="gui-main">
        <header className="gui-main-head">
          <h1>
            Works <span className="crumb">/ Gos &amp; co / {works.length} works</span>
          </h1>
          <div className="gui-toolbar">
            <input
              className="input"
              placeholder="Filter works…"
              style={{ width: 220, fontSize: 13, padding: '7px 10px' }}
            />
            <button type="button" className="btn primary small">
              + New work
            </button>
          </div>
        </header>
        <WorksList />
      </main>
      <WorkDetail />
    </>
  );
}
