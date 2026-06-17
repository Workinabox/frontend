import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoMark from '../components/LogoMark.tsx';
import { signup } from '../features/auth/authApi.ts';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signup(email, password, name);
      setSent(true);
    } catch {
      setError('Sign up is not available.');
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
        <div className="th">Create your account</div>
        {sent ? (
          <p style={{ fontSize: 13 }}>
            Check your email — we&apos;ve sent a link to confirm your address and activate your
            account.
          </p>
        ) : (
          <>
            <div className="field">
              <label htmlFor="signup-name">Name</label>
              <input
                id="signup-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                className="input"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                className="input"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? (
              <p style={{ color: 'var(--red, #c0392b)', fontSize: 12 }}>{error}</p>
            ) : null}
            <div className="actions">
              <button
                type="submit"
                className="btn primary small"
                disabled={busy || name.trim() === '' || email.trim() === '' || password.length < 8}
              >
                {busy ? 'Creating…' : 'Sign up'}
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
