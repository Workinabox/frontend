// Mirror the backend user/credential snapshots.
export type SshKey = { id: string; label: string; fingerprint: string };

export type TokenScope = {
  read_only: boolean;
  repos: string[] | null;
  orgs: string[] | null;
};

export type AccessToken = {
  id: string;
  label: string;
  display: string;
  created_at: string;
  expires_at: string | null;
  last_used_at: string | null;
  scope: TokenScope;
};

export type User = {
  id: string; // e.g. "U-1"
  kind: string; // "human" | "agent"
  name: string;
  email: string | null;
  state: string; // "active" | "pending" | "deactivated"
  agent_id: string | null;
  ssh_keys: SshKey[];
  tokens: AccessToken[];
};

// Returned once at token creation, carrying the one-time plaintext.
export type IssuedToken = AccessToken & { plaintext: string };
