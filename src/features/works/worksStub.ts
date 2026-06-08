import type { WorkSnapshot } from './types.ts';

// Demo data mirroring Section 9.1 of the visual identity, shaped exactly like
// the backend `WorkSnapshot`. Children stand in for the "N tasks" count; the
// domain only tracks `is_done`, so each row is either completed or in progress.
const tasks = (n: number): WorkSnapshot[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `task-${i}`,
    title: `Task ${i + 1}`,
    description: '',
    dones: [],
    children: [],
    is_done: false,
  }));

export const worksStub: WorkSnapshot[] = [
  {
    id: 'W-1',
    title: 'Persistence & migrations',
    description:
      'Move all repositories behind Postgres; reversible migrations gated in CI.',
    dones: [
      { id: 'd1', criterion: 'traits unchanged at call sites', fulfilled: true },
      { id: 'd2', criterion: 'up + down migration tested', fulfilled: true },
      { id: 'd3', criterion: 'load test < 50ms p95', fulfilled: false },
    ],
    children: tasks(6),
    is_done: false,
  },
  {
    id: 'W-2',
    title: 'Public website — workinabox.ai',
    description:
      'Marketing site + docs published from the docs/ repo. Request-access flow.',
    dones: [{ id: 'd4', criterion: 'docs build pipeline green', fulfilled: true }],
    children: tasks(4),
    is_done: false,
  },
  {
    id: 'W-3',
    title: 'Observability baseline',
    description:
      'OpenTelemetry traces and structured logs through every crate.',
    dones: [{ id: 'd5', criterion: 'trace IDs propagate end-to-end', fulfilled: false }],
    children: tasks(3),
    is_done: false,
  },
  {
    id: 'W-4',
    title: 'Mobile delivery',
    description:
      'Signed TestFlight + Play internal builds on every tagged release.',
    dones: [],
    children: tasks(2),
    is_done: false,
  },
  {
    id: 'W-5',
    title: 'Identity & access',
    description: 'Choose an IdP, integrate SSO, enforce org-scoped roles.',
    dones: [],
    children: tasks(1),
    is_done: false,
  },
  {
    id: 'W-6',
    title: 'Local dev bootstrap',
    description: 'One command brings up the full stack for contributors.',
    dones: [
      { id: 'd6', criterion: 'single command up', fulfilled: true },
      { id: 'd7', criterion: 'documented in README', fulfilled: true },
    ],
    children: tasks(4),
    is_done: true,
  },
];
