import { type FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LogoMark from '../components/LogoMark.tsx';
import { config } from '../config.ts';
import { fetchAuthConfig, login } from '../features/auth/authApi.ts';
import { useSession } from '../features/auth/SessionContext.tsx';
import type { AuthConfig } from '../features/auth/types.ts';

export default function LoginPage() {
  const { session, refresh } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get('next') ?? '/works';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [methods, setMethods] = useState<AuthConfig | null>(null);

  useEffect(() => {
    fetchAuthConfig()
      .then(setMethods)
      .catch(() => setMethods(null));
  }, []);

  // Already signed in — skip the form.
  if (session) return <Navigate to={next} replace />;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      await refresh();
      navigate(next, { replace: true });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setBusy(false);
    }
  };

  const apiBase = config.apiBaseUrl;
  const ssoNext = encodeURIComponent(next);

  return (
    <div className="modal-overlay" style={{ background: 'var(--bg)' }}>
      <form className="modal" onSubmit={onSubmit}>
        <div className="brand" style={{ marginBottom: 4 }}>
          <LogoMark size={22} strokeWidth={13} />
          <div className="lwm">
            Workin<span className="a">a</span>box
          </div>
        </div>
        <div className="th">Sign in</div>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? (
          <p style={{ color: 'var(--red, #c0392b)', fontSize: 12, margin: '4px 0 0' }}>{error}</p>
        ) : null}
        <div className="actions">
          <button
            type="submit"
            className="btn primary small"
            disabled={busy || email.trim() === '' || password === ''}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
        <p style={{ marginTop: 8, fontSize: 12 }}>
          <Link to="/forgot-password">Forgot password?</Link>
          {methods?.signup ? (
            <>
              {' · '}
              <Link to="/signup">Create an account</Link>
            </>
          ) : null}
        </p>
        {methods?.google || methods?.oidc ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {methods.google ? (
              <a className="btn ghost small" href={`${apiBase}/auth/oidc/google/start?next=${ssoNext}`}>
                Continue with Google
              </a>
            ) : null}
            {methods.oidc ? (
              <a
                className="btn ghost small"
                href={`${apiBase}/auth/oidc/enterprise/start?next=${ssoNext}`}
              >
                Sign in with SSO
              </a>
            ) : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}
