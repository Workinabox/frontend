import type { Organization, Project } from '../context/types.ts';
import type { Agent } from '../agents/types.ts';
import type { Board } from '../boards/types.ts';
import type { Repo } from '../repos/types.ts';
import type { Pipeline } from '../pipelines/types.ts';
import type { WorkSnapshot } from '../works/types.ts';

// Mutable in-memory stub database, used when `config.useStub` is on so the
// frontend behaves like the real backend without it running. Seeds mirror
// the backend bootstrap: org O-1 → project P-1, plus six demo works.

// Demo data mirroring Section 9.1 of the visual identity, shaped exactly like
// the backend `WorkSnapshot`. Children stand in for the "N tasks" count; the
// domain only tracks `is_done`, so each row is either completed or in progress.
const tasks = (n: number): WorkSnapshot[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `task-${i}`,
    project_id: 'P-1',
    title: `Task ${i + 1}`,
    description: '',
    dones: [],
    children: [],
    is_done: false,
  }));

export const db = {
  organizations: [
    { id: 'O-1', name: 'Gos & co', description: '' },
  ] as Organization[],
  projects: [
    {
      id: 'P-1',
      organization_id: 'O-1',
      name: 'Workinabox',
      description: '',
    },
  ] as Project[],
  agents: [] as Agent[],
  boards: [] as Board[],
  repos: [] as Repo[],
  pipelines: [] as Pipeline[],
  works: [
    {
      id: 'W-1',
      project_id: 'P-1',
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
      project_id: 'P-1',
      title: 'Public website — workinabox.ai',
      description:
        'Marketing site + docs published from the docs/ repo. Request-access flow.',
      dones: [{ id: 'd4', criterion: 'docs build pipeline green', fulfilled: true }],
      children: tasks(4),
      is_done: false,
    },
    {
      id: 'W-3',
      project_id: 'P-1',
      title: 'Observability baseline',
      description:
        'OpenTelemetry traces and structured logs through every crate.',
      dones: [{ id: 'd5', criterion: 'trace IDs propagate end-to-end', fulfilled: false }],
      children: tasks(3),
      is_done: false,
    },
    {
      id: 'W-4',
      project_id: 'P-1',
      title: 'Mobile delivery',
      description:
        'Signed TestFlight + Play internal builds on every tagged release.',
      dones: [],
      children: tasks(2),
      is_done: false,
    },
    {
      id: 'W-5',
      project_id: 'P-1',
      title: 'Identity & access',
      description: 'Choose an IdP, integrate SSO, enforce org-scoped roles.',
      dones: [],
      children: tasks(1),
      is_done: false,
    },
    {
      id: 'W-6',
      project_id: 'P-1',
      title: 'Local dev bootstrap',
      description: 'One command brings up the full stack for contributors.',
      dones: [
        { id: 'd6', criterion: 'single command up', fulfilled: true },
        { id: 'd7', criterion: 'documented in README', fulfilled: true },
      ],
      children: tasks(4),
      is_done: true,
    },
  ] as WorkSnapshot[],
};

// Backend-format ids ("W-1", "PL-2", …); create-only world, so collision-free.
export function nextId(prefix: string, collection: { id: string }[]): string {
  return prefix + '-' + (collection.length + 1);
}

// Mimic network latency so loading states are exercised. structuredClone
// because Redux/immer freezes store objects in dev — returning db references
// would make later stub mutations throw.
export function respond<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), 300));
}
