// Mirrors the backend `WorkSnapshot` JSON (wiab-core/src/work/work_snapshot.rs).
export type DoneView = {
  id: string;
  criterion: string;
  fulfilled: boolean;
};

export type WorkSnapshot = {
  id: string; // e.g. "W-1"
  project_id: string; // e.g. "P-1"
  title: string;
  description: string;
  dones: DoneView[];
  is_done: boolean;
};
