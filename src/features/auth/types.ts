// The authenticated user, as returned by GET /auth/session.
export interface CurrentUser {
  id: string;
  name: string;
  email: string | null;
  is_owner: boolean;
}

// Which login methods the backend has enabled (drives which buttons the login page shows).
export interface AuthConfig {
  local_password: boolean;
  signup: boolean;
  google: boolean;
  oidc: boolean;
}

export interface LoginResponse {
  user: CurrentUser;
  csrf_token: string;
}
