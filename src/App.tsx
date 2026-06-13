import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ConsoleLayout from './components/ConsoleLayout.tsx';
import SignIn from './components/SignIn.tsx';
import WorksPage from './pages/WorksPage.tsx';
import BoardsPage from './pages/BoardsPage.tsx';
import AgentsPage from './pages/AgentsPage.tsx';
import ReposPage from './pages/ReposPage.tsx';
import PipelinesPage from './pages/PipelinesPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import MembersPage from './pages/MembersPage.tsx';
import Placeholder from './pages/Placeholder.tsx';
import { config } from './config.ts';
import { getToken } from './auth.ts';

export default function App() {
  const [authed, setAuthed] = useState(config.useStub || getToken() !== '');

  if (!authed) {
    return <SignIn onSignedIn={() => setAuthed(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ConsoleLayout />}>
          <Route index element={<Navigate to="/works" replace />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/board" element={<BoardsPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/repos" element={<ReposPage />} />
          <Route path="/traces" element={<Placeholder title="Traces" />} />
          <Route path="/rooms" element={<Placeholder title="Rooms" />} />
          <Route path="/security" element={<Placeholder title="Security gates" />} />
          <Route path="/pipelines" element={<PipelinesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/members" element={<MembersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
