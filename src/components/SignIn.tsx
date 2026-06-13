import { useState } from 'react';
import { setToken } from '../auth.ts';
import LogoMark from './LogoMark.tsx';

// Token paste-in sign-in. Replaced later by the SSO identity provider (roadmap #19).
export default function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [token, setTokenInput] = useState('');

  return (
    <div className="modal-overlay" style={{ background: 'var(--bg)' }}>
      <form
        className="modal"
        onSubmit={(e) => {
          e.preventDefault();
          setToken(token);
          onSignedIn();
        }}
      >
        <div className="brand" style={{ marginBottom: 4 }}>
          <LogoMark size={22} strokeWidth={13} />
          <div className="lwm">
            Workin<span className="a">a</span>box
          </div>
        </div>
        <div className="th">Sign in</div>
        <div className="field">
          <label htmlFor="signin-token">Access token</label>
          <input
            id="signin-token"
            className="input"
            type="password"
            placeholder="wiab_pat_…"
            value={token}
            onChange={(e) => setTokenInput(e.target.value)}
            autoFocus
          />
          <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '6px 0 0' }}>
            Paste a wiab access token. On first boot the backend logs a bootstrap owner token.
          </p>
        </div>
        <div className="actions">
          <button type="submit" className="btn primary small" disabled={token.trim() === ''}>
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
