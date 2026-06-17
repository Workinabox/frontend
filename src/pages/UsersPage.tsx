import { useEffect, useState } from 'react';
import type { IssuedToken, User } from '../features/users/types.ts';
import {
  activateUser,
  addSshKey,
  createUser,
  deactivateUser,
  fetchUser,
  fetchUsers,
  inviteUser,
  issueToken,
  removeSshKey,
  revokeToken,
} from '../features/users/usersApi.ts';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>();
  const [selected, setSelected] = useState<User>();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [keyLabel, setKeyLabel] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [tokenLabel, setTokenLabel] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const [issued, setIssued] = useState<IssuedToken>();

  const reloadUsers = () =>
    fetchUsers()
      .then(setUsers)
      .catch((e) => setError(String(e)));

  useEffect(() => {
    void reloadUsers();
  }, []);

  useEffect(() => {
    if (selectedId) {
      void fetchUser(selectedId).then(setSelected).catch(() => setSelected(undefined));
    } else {
      setSelected(undefined);
    }
    setIssued(undefined);
  }, [selectedId]);

  const refreshSelected = (u: User) => {
    setSelected(u);
    setUsers((prev) => prev.map((p) => (p.id === u.id ? u : p)));
  };

  return (
    <>
      <main className="gui-main">
        <header className="gui-main-head">
          <h1>Users</h1>
          <div className="gui-toolbar">
            <button type="button" className="btn primary small" onClick={() => setCreating(true)}>
              + New user
            </button>
            <button type="button" className="btn ghost small" onClick={() => setInviting(true)}>
              Invite
            </button>
          </div>
        </header>
        {error ? <div className="gui-empty">Failed to load users: {error}</div> : null}
        {creating ? (
          <form
            className="card"
            style={{ padding: 12, marginBottom: 10 }}
            onSubmit={async (e) => {
              e.preventDefault();
              const u = await createUser({ kind: 'human', name: name.trim(), email: null });
              setName('');
              setCreating(false);
              await reloadUsers();
              setSelectedId(u.id);
            }}
          >
            <div className="field">
              <label htmlFor="new-user-name">New user name</label>
              <input
                id="new-user-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="actions">
              <button type="button" className="btn ghost small" onClick={() => setCreating(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary small" disabled={name.trim() === ''}>
                Create
              </button>
            </div>
          </form>
        ) : null}
        {inviting ? (
          <form
            className="card"
            style={{ padding: 12, marginBottom: 10 }}
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await inviteUser({ name: inviteName.trim(), email: inviteEmail.trim() });
                setInviteName('');
                setInviteEmail('');
                setInviting(false);
                await reloadUsers();
              } catch (err) {
                setError(String(err));
              }
            }}
          >
            <div className="field">
              <label htmlFor="invite-name">Invite name</label>
              <input
                id="invite-name"
                className="input"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="invite-email">Email</label>
              <input
                id="invite-email"
                className="input"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="actions">
              <button type="button" className="btn ghost small" onClick={() => setInviting(false)}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn primary small"
                disabled={inviteName.trim() === '' || inviteEmail.trim() === ''}
              >
                Send invite
              </button>
            </div>
          </form>
        ) : null}
        <div className="gui-list" style={{ gap: 10 }}>
          {users.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`gui-row${u.id === selectedId ? ' sel' : ''}`}
              style={{ gridTemplateColumns: '64px 1fr' }}
              onClick={() => setSelectedId(u.id)}
            >
              <span className="rid">{u.id}</span>
              <span>
                <span className="rt">{u.name}</span>
                <div className="rsub">
                  {u.kind}
                  {u.state !== 'active' ? ` · ${u.state}` : ''}
                </div>
              </span>
            </button>
          ))}
        </div>
      </main>

      <aside className="gui-trace">
        {selected ? (
          <>
            <div className="th">
              — User · {selected.id} ({selected.kind})
            </div>

            <div className="kv">
              <span className="k">Status</span>
              <span className="v" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="rsub">{selected.state}</span>
                {selected.state === 'deactivated' ? (
                  <button
                    type="button"
                    className="btn ghost small"
                    onClick={async () => refreshSelected(await activateUser(selected.id))}
                  >
                    Activate
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn ghost small"
                    onClick={async () => refreshSelected(await deactivateUser(selected.id))}
                  >
                    Deactivate
                  </button>
                )}
              </span>
            </div>

            <div className="th" style={{ border: 'none', padding: '8px 0 6px' }}>
              SSH keys
            </div>
            {selected.ssh_keys.map((k) => (
              <div className="kv" key={k.id}>
                <span className="k">{k.label}</span>
                <span className="v" style={{ display: 'flex', gap: 8 }}>
                  <code style={{ fontSize: 11 }}>{k.fingerprint}</code>
                  <button
                    type="button"
                    className="btn ghost small"
                    onClick={async () => refreshSelected(await removeSshKey(selected.id, k.id))}
                  >
                    Remove
                  </button>
                </span>
              </div>
            ))}
            <form
              style={{ marginTop: 6 }}
              onSubmit={async (e) => {
                e.preventDefault();
                const u = await addSshKey(selected.id, {
                  label: keyLabel.trim(),
                  public_key: publicKey.trim(),
                });
                setKeyLabel('');
                setPublicKey('');
                refreshSelected(u);
              }}
            >
              <input
                className="input"
                placeholder="Key label"
                value={keyLabel}
                onChange={(e) => setKeyLabel(e.target.value)}
              />
              <textarea
                className="input"
                rows={2}
                placeholder="ssh-ed25519 AAAA…"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                style={{ marginTop: 6 }}
              />
              <div className="actions">
                <button
                  type="submit"
                  className="btn primary small"
                  disabled={keyLabel.trim() === '' || publicKey.trim() === ''}
                >
                  Add key
                </button>
              </div>
            </form>

            <div className="th" style={{ border: 'none', padding: '12px 0 6px' }}>
              Access tokens
            </div>
            {issued ? (
              <div className="card" style={{ padding: 10, marginBottom: 8 }}>
                <div className="rsub">Copy this token now — it is shown only once:</div>
                <code style={{ wordBreak: 'break-all', fontSize: 12 }}>{issued.plaintext}</code>
              </div>
            ) : null}
            {selected.tokens.map((t) => (
              <div className="kv" key={t.id}>
                <span className="k">{t.label}</span>
                <span className="v" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <code style={{ fontSize: 11 }}>{t.display}</code>
                  {t.scope.read_only ? <span className="rsub">read-only</span> : null}
                  <button
                    type="button"
                    className="btn ghost small"
                    onClick={async () => {
                      refreshSelected(await revokeToken(selected.id, t.id));
                      setIssued(undefined);
                    }}
                  >
                    Revoke
                  </button>
                </span>
              </div>
            ))}
            <form
              style={{ marginTop: 6 }}
              onSubmit={async (e) => {
                e.preventDefault();
                const result = await issueToken(selected.id, {
                  label: tokenLabel.trim(),
                  read_only: readOnly,
                  repos: null,
                  orgs: null,
                  expires_at: null,
                });
                setTokenLabel('');
                setReadOnly(false);
                setIssued(result);
                refreshSelected(await fetchUser(selected.id));
              }}
            >
              <input
                className="input"
                placeholder="Token label"
                value={tokenLabel}
                onChange={(e) => setTokenLabel(e.target.value)}
              />
              <label style={{ display: 'flex', gap: 6, alignItems: 'center', margin: '6px 0' }}>
                <input
                  type="checkbox"
                  checked={readOnly}
                  onChange={(e) => setReadOnly(e.target.checked)}
                />
                <span className="rsub">read-only</span>
              </label>
              <div className="actions">
                <button
                  type="submit"
                  className="btn primary small"
                  disabled={tokenLabel.trim() === ''}
                >
                  Issue token
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="th">— User</div>
            <div className="gui-empty">Select a user to manage keys and tokens.</div>
          </>
        )}
      </aside>
    </>
  );
}
