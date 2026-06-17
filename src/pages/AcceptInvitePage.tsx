import { type FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LogoMark from '../components/LogoMark.tsx';
import { acceptInvite } from '../features/auth/authApi.ts';
import { useSession } from '../features/auth/SessionContext.tsx';

export default function AcceptInvitePage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const { refresh } = useSession();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await acceptInvite(token, password);
      await refresh();
      navigate('/works', { replace: true });
    } catch {
      setError('This invite link is invalid or has expired.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ background: 'var(--bg)' }}>
      <form className="modal" onSubmit={onSubmit}>
        <div className="brand" style={{ marginBottom: 4 }}>
          <LogoMark size={22} strokeWidth={13} />
          <div className="lwm">
            Workin<span className="a">a</span>box
          </div>
        </div>
        <div className="th">Set your password</div>
        {token === '' ? (
          <p style={{ fontSize: 13, color: 'var(--red, #c0392b)' }}>
            This invite link is missing its token.
          </p>
        ) : (
          <>
            <div className="field">
              <label htmlFor="invite-password">Choose a password</label>
              <input
                id="invite-password"
                className="input"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {error ? (
              <p style={{ color: 'var(--red, #c0392b)', fontSize: 12 }}>{error}</p>
            ) : null}
            <div className="actions">
              <button
                type="submit"
                className="btn primary small"
                disabled={busy || password.length < 8}
              >
                {busy ? 'Setting up…' : 'Set password & sign in'}
              </button>
            </div>
          </>
        )}
        <p style={{ marginTop: 10, fontSize: 12 }}>
          <Link to="/login">Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}
