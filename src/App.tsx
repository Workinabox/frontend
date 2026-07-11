import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import FrontendLayout from './components/FrontendLayout.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/ResetPasswordPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import AcceptInvitePage from './pages/AcceptInvitePage.tsx';
import VerifyEmailPage from './pages/VerifyEmailPage.tsx';
import WorksPage from './pages/WorksPage.tsx';
import BoardsPage from './pages/BoardsPage.tsx';
import AgentsPage from './pages/AgentsPage.tsx';
import ReposPage from './pages/ReposPage.tsx';
import PipelinesPage from './pages/PipelinesPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import MembersPage from './pages/MembersPage.tsx';
import AccountPage from './pages/AccountPage.tsx';
import Placeholder from './pages/Placeholder.tsx';
import { SessionProvider, useSession } from './features/auth/SessionContext.tsx';

// Gate the frontend behind a session; redirect to login (preserving where we were headed).
function RequireAuth() {
  const { session, loading } = useSession();
  const location = useLocation();
  if (loading) return null;
  if (!session) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return <Outlet />;
}

// Owner-only sections (user/role management).
function RequireOwner() {
  const { session } = useSession();
  if (!session?.is_owner) return <Navigate to="/works" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/accept-invite" element={<AcceptInvitePage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<FrontendLayout />}>
              <Route index element={<Navigate to="/works" replace />} />
              <Route path="/works" element={<WorksPage />} />
              <Route path="/board" element={<BoardsPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/repos" element={<ReposPage />} />
              <Route path="/traces" element={<Placeholder title="Traces" />} />
              <Route path="/rooms" element={<Placeholder title="Rooms" />} />
              <Route path="/security" element={<Placeholder title="Security gates" />} />
              <Route path="/pipelines" element={<PipelinesPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route element={<RequireOwner />}>
                <Route path="/users" element={<UsersPage />} />
                <Route path="/members" element={<MembersPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
