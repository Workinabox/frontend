import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ConsoleLayout from './components/ConsoleLayout.tsx';
import WorksPage from './pages/WorksPage.tsx';
import BoardsPage from './pages/BoardsPage.tsx';
import AgentsPage from './pages/AgentsPage.tsx';
import ReposPage from './pages/ReposPage.tsx';
import PipelinesPage from './pages/PipelinesPage.tsx';
import Placeholder from './pages/Placeholder.tsx';

export default function App() {
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
