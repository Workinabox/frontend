// Mirror the backend role-assignment snapshot.
export type RoleAssignment = {
  id: string; // e.g. "G-1"
  user_id: string;
  scope_kind: string; // "org" | "project" | "repo"
  scope_id: string;
  role: string; // "read" | "write" | "admin" | "owner"
};
