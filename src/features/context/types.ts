// Mirror the backend organization/project snapshots.
export type Organization = {
  id: string; // e.g. "O-1"
  name: string;
  description: string;
};

export type Project = {
  id: string; // e.g. "P-1"
  organization_id: string;
  name: string;
  description: string;
};
