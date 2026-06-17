import { type FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LogoMark from '../components/LogoMark.tsx';
import { confirmPasswordReset } from '../features/auth/authApi.ts';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await confirmPasswordReset(token, password);
      setDone(true);
    } catch {
      setError('This reset link is invalid or has expired.');
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
        <div className="th">Choose a new password</div>
        {done ? (
          <>
            <p style={{ fontSize: 13 }}>Your password has been updated.</p>
            <div className="actions">
              <button
                type="button"
                className="btn primary small"
                onClick={() => navigate('/login')}
              >
                Sign in
              </button>
            </div>
          </>
        ) : token === '' ? (
          <p style={{ fontSize: 13, color: 'var(--red, #c0392b)' }}>
            This reset link is missing its token.
          </p>
        ) : (
          <>
            <div className="field">
              <label htmlFor="reset-password">New password</label>
              <input
                id="reset-password"
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
                {busy ? 'Saving…' : 'Update password'}
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
