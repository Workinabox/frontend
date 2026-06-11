import { useEffect } from 'react';
import { config } from '../config.ts';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import {
  loadHealth,
  selectBackendVersion,
  selectStatusOnline,
} from '../features/status/statusSlice.ts';

const POLL_MS = 10_000;

// Lower-left status pill: frontend + backend version and a green/red dot
// reflecting backend reachability. Polls /health every 10s.
export default function StatusBadge() {
  const dispatch = useAppDispatch();
  const online = useAppSelector(selectStatusOnline);
  const backendVersion = useAppSelector(selectBackendVersion);

  useEffect(() => {
    dispatch(loadHealth());
    const id = setInterval(() => dispatch(loadHealth()), POLL_MS);
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <div className="status-badge" title={online ? 'Backend reachable' : 'Backend unreachable'}>
      <span className={`status-dot ${online ? 'up' : 'down'}`} />
      <span className="status-versions">
        fe {config.appVersion} · be {backendVersion ?? '—'}
      </span>
    </div>
  );
}
