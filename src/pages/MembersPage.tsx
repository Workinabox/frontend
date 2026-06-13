import { useEffect, useState } from 'react';
import { useAppSelector } from '../app/hooks.ts';
import { selectCurrentOrgId } from '../features/context/contextSlice.ts';
import type { RoleAssignment } from '../features/access/types.ts';
import { grantRole, listRoleAssignments, revokeRole } from '../features/access/accessApi.ts';
import type { User } from '../features/users/types.ts';
import { fetchUsers } from '../features/users/usersApi.ts';

const ROLES = ['read', 'write', 'admin', 'owner'];
const SCOPES = ['org', 'project', 'repo'];

export default function MembersPage() {
  const currentOrgId = useAppSelector(selectCurrentOrgId);
  const [assignments, setAssignments] = useState<RoleAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>();

  const [userId, setUserId] = useState('');
  const [scopeKind, setScopeKind] = useState('org');
  const [scopeId, setScopeId] = useState('');
  const [role, setRole] = useState('read');

  const reload = () =>
    listRoleAssignments()
      .then(setAssignments)
      .catch((e) => setError(String(e)));

  useEffect(() => {
    void reload();
    void fetchUsers()
      .then(setUsers)
      .catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    if (currentOrgId && scopeKind === 'org' && scopeId === '') setScopeId(currentOrgId);
  }, [currentOrgId, scopeKind, scopeId]);

  const userName = (id: string) => users.find((u) => u.id === id)?.name ?? id;

  return (
    <>
      <main className="gui-main">
        <header className="gui-main-head">
          <h1>Members &amp; roles</h1>
        </header>
        {error ? <div className="gui-empty">{error}</div> : null}
        <div className="gui-list" style={{ gap: 10 }}>
          {assignments.length === 0 ? <div className="gui-empty">No grants yet.</div> : null}
          {assignments.map((a) => (
            <div
              key={a.id}
              className="gui-row"
              style={{ gridTemplateColumns: '1fr auto', cursor: 'default' }}
            >
              <span>
                <span className="rt">
                  {userName(a.user_id)} — {a.role}
                </span>
                <div className="rsub">
                  {a.scope_kind} {a.scope_id} · {a.user_id}
                </div>
              </span>
              <button
                type="button"
                className="btn ghost small"
                onClick={async () => {
                  await revokeRole(a.id);
                  await reload();
                }}
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      </main>

      <aside className="gui-trace">
        <div className="th">— Grant a role</div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await grantRole({ user_id: userId, scope_kind: scopeKind, scope_id: scopeId, role });
            setUserId('');
            await reload();
          }}
        >
          <div className="field">
            <label htmlFor="grant-user">User</label>
            <select
              id="grant-user"
              className="input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="">Select a user…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.id})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="grant-scope-kind">Scope</label>
            <select
              id="grant-scope-kind"
              className="input"
              value={scopeKind}
              onChange={(e) => setScopeKind(e.target.value)}
            >
              {SCOPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="grant-scope-id">Scope id (e.g. O-1, P-1, R-1)</label>
            <input
              id="grant-scope-id"
              className="input"
              value={scopeId}
              onChange={(e) => setScopeId(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="grant-role">Role</label>
            <select
              id="grant-role"
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="actions">
            <button
              type="submit"
              className="btn primary small"
              disabled={userId === '' || scopeId.trim() === ''}
            >
              Grant
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
