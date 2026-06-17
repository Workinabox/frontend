import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoMark from '../components/LogoMark.tsx';
import { requestPasswordReset } from '../features/auth/authApi.ts';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    // Always show the same neutral confirmation — the server never reveals whether the
    // address exists, and we mirror that here.
    try {
      await requestPasswordReset(email);
    } catch {
      /* ignore */
    }
    setSent(true);
    setBusy(false);
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
        <div className="th">Reset your password</div>
        {sent ? (
          <p style={{ fontSize: 13 }}>
            If an account exists for that address, we&apos;ve sent a reset link. Check your email.
          </p>
        ) : (
          <>
            <div className="field">
              <label htmlFor="forgot-email">Email</label>
              <input
                id="forgot-email"
                className="input"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div className="actions">
              <button
                type="submit"
                className="btn primary small"
                disabled={busy || email.trim() === ''}
              >
                {busy ? 'Sending…' : 'Send reset link'}
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
