// Mirrors the backend `/health` JSON (wiab-inf/src/http_api.rs `Health`).
export type Health = {
  status: string;
  version: string;
};
