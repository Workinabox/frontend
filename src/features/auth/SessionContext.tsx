import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { config } from '../../config.ts';
import { fetchSession, logout as logoutApi } from './authApi.ts';
import type { CurrentUser } from './types.ts';

interface SessionState {
  session: CurrentUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

// When the Works stub is on, the backend isn't running, so stand in a fake owner.
const STUB_USER: CurrentUser = { id: 'U-0', name: 'Stub', email: null, is_owner: true };

const SessionContext = createContext<SessionState | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (config.useStub) {
      setSession(STUB_USER);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setSession(await fetchSession());
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!config.useStub) await logoutApi();
    setSession(null);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <SessionContext.Provider value={{ session, loading, refresh, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- provider + its hook colocate
export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
}
