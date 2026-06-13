import { NavLink } from 'react-router-dom';
import ContextSwitcher from './ContextSwitcher.tsx';
import LogoMark from './LogoMark.tsx';
import StatusBadge from './StatusBadge.tsx';
import { clearToken } from '../auth.ts';

// Nav icons (24px grid, 1.6px stroke) lifted from the visual identity's
// console-screens.js. The "specs" glyph is reused for Works.
const ICONS: Record<string, string> = {
  works:
    'M6 3 L15 3 L19 7 L19 21 L6 21 Z M15 3 L15 7 L19 7 M9 12 L16 12 M9 16 L16 16 M9 8 L12 8',
  board:
    'M3 4 h5.5 v16 h-5.5 Z M9.25 4 h5.5 v11 h-5.5 Z M15.5 4 h5.5 v7 h-5.5 Z',
  agents:
    'M12 9 m-3.5 0 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 M4.5 20 C 5 15.5 8.5 13.5 12 13.5 C 15.5 13.5 19 15.5 19.5 20',
  repos:
    'M5 4 L5 18 a2 2 0 0 0 2 2 L19 20 L19 4 L7 4 a2 2 0 0 0 -2 2 a2 2 0 0 0 2 2 L19 8',
  traces:
    'M6 6 m-1.5 0 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 M6 18 m-1.5 0 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 M6 7.5 L6 16.5 M9 6 L20 6 M9 12 L17 12 M9 18 L14 18',
  rooms:
    'M9 3 h6 v12 a3 3 0 0 1 -6 0 Z M6 11 a6 6 0 0 0 12 0 M12 17 L12 21 M9 21 L15 21',
  security:
    'M12 3 L20 6 L20 12 C 20 16 16.5 19.5 12 21 C 7.5 19.5 4 16 4 12 L 4 6 Z M9 12 L11 14 L15 10',
  pipelines:
    'M3 9 h5 v6 h-5 Z M9.5 9 h5 v6 h-5 Z M16 9 h5 v6 h-5 Z M8 12 L9.5 12 M14.5 12 L16 12',
};

function Icon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

type NavEntry = { key: string; label: string; to: string; count?: string };

function NavItem({ entry }: { entry: NavEntry }) {
  return (
    <NavLink to={entry.to}>
      <Icon name={entry.key} />
      {entry.label}
      {entry.count ? (
        <span
          className="count"
          style={entry.count.includes('live') ? { color: 'var(--orange)' } : undefined}
        >
          {entry.count}
        </span>
      ) : null}
    </NavLink>
  );
}

const main: NavEntry[] = [
  { key: 'works', label: 'Works', to: '/works' },
  { key: 'board', label: 'Board', to: '/board' },
  { key: 'agents', label: 'Agents', to: '/agents' },
  { key: 'repos', label: 'Repos', to: '/repos' },
  { key: 'traces', label: 'Traces', to: '/traces' },
];
const meetings: NavEntry[] = [{ key: 'rooms', label: 'Rooms', to: '/rooms', count: '2 live' }];
const system: NavEntry[] = [
  { key: 'security', label: 'Security gates', to: '/security' },
  { key: 'pipelines', label: 'Pipelines', to: '/pipelines' },
];
const settings: NavEntry[] = [
  { key: 'agents', label: 'Users', to: '/users' },
  { key: 'security', label: 'Members', to: '/members' },
];

export default function Sidebar() {
  return (
    <aside className="gui-side">
      <div className="brand">
        <LogoMark size={22} strokeWidth={13} />
        <div className="lwm">
          Workin<span className="a">a</span>box
        </div>
      </div>
      <ContextSwitcher />
      {main.map((e) => (
        <NavItem key={e.key} entry={e} />
      ))}
      <span className="group">Meetings</span>
      {meetings.map((e) => (
        <NavItem key={e.key} entry={e} />
      ))}
      <span className="group">System</span>
      {system.map((e) => (
        <NavItem key={e.key} entry={e} />
      ))}
      <span className="group">Settings</span>
      {settings.map((e) => (
        <NavItem key={e.label} entry={e} />
      ))}
      <button
        type="button"
        className="btn ghost small"
        style={{ margin: '8px 12px' }}
        onClick={() => {
          clearToken();
          window.location.reload();
        }}
      >
        Sign out
      </button>
      <StatusBadge />
    </aside>
  );
}
