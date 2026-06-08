import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ConsoleLayout from './components/ConsoleLayout.tsx';
import WorksPage from './pages/WorksPage.tsx';
import Placeholder from './pages/Placeholder.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ConsoleLayout />}>
          <Route index element={<Navigate to="/works" replace />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/board" element={<Placeholder title="Board" />} />
          <Route path="/agents" element={<Placeholder title="Agents" />} />
          <Route path="/repos" element={<Placeholder title="Repos" />} />
          <Route path="/traces" element={<Placeholder title="Traces" />} />
          <Route path="/rooms" element={<Placeholder title="Rooms" />} />
          <Route path="/security" element={<Placeholder title="Security gates" />} />
          <Route path="/pipelines" element={<Placeholder title="Pipelines" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
