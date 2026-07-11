import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.tsx';

// Rounded page frame + 3-column body (sidebar | main | trace), as in
// Section 9 of the visual identity. Each page renders its own <main> and
// right <aside> via the Outlet.
export default function FrontendLayout() {
  return (
    <div className="gui-frame">
      <div className="gui-body">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
