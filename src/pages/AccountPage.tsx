import { type FormEvent, useState } from 'react';
import axios from 'axios';
import { changePassword } from '../features/auth/authApi.ts';
import { useSession } from '../features/auth/SessionContext.tsx';

export default function AccountPage() {
  const { session } = useSession();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      await changePassword(current, next);
      setMessage({ ok: true, text: 'Password updated.' });
      setCurrent('');
      setNext('');
    } catch (error) {
      const text =
        (axios.isAxiosError(error) && typeof error.response?.data === 'string'
          ? error.response.data
          : null) ?? 'Could not change password.';
      setMessage({ ok: false, text });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <main className="gui-main">
        <header className="gui-main-head">
          <h1>Account</h1>
        </header>
        <div style={{ padding: '0 16px', maxWidth: 420 }}>
          <p style={{ color: 'var(--ink-soft)' }}>
            Signed in as <strong>{session?.name}</strong>
            {session?.email ? ` · ${session.email}` : ''}
          </p>
          <form className="modal" style={{ marginTop: 12 }} onSubmit={onSubmit}>
            <div className="th">Change password</div>
            <div className="field">
              <label htmlFor="account-current">Current password</label>
              <input
                id="account-current"
                className="input"
                type="password"
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="account-new">New password</label>
              <input
                id="account-new"
                className="input"
                type="password"
                autoComplete="new-password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
              />
            </div>
            {message ? (
              <p
                style={{
                  color: message.ok ? 'var(--green, #2e7d32)' : 'var(--red, #c0392b)',
                  fontSize: 12,
                  margin: '4px 0 0',
                }}
              >
                {message.text}
              </p>
            ) : null}
            <div className="actions">
              <button
                type="submit"
                className="btn primary small"
                disabled={busy || current === '' || next.length < 8}
              >
                {busy ? 'Saving…' : 'Update password'}
              </button>
            </div>
          </form>
          <p style={{ color: 'var(--ink-soft)', fontSize: 12, marginTop: 12 }}>
            Manage access tokens and SSH keys on the Users page.
          </p>
        </div>
      </main>
      <aside className="gui-trace">
        <div className="th">— Account</div>
      </aside>
    </>
  );
}
