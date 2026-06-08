import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.tsx';

// Browser-chrome frame + 3-column body (sidebar | main | trace), as in
// Section 9 of the visual identity. Each page renders its own <main> and
// right <aside> via the Outlet.
export default function ConsoleLayout() {
  return (
    <div className="gui-frame">
      <div className="gui-titlebar">
        <div className="dots">
          <span />
          <span />
          <span />
        </div>
        <div className="url">app.workinabox.ai/orgs/gos/works</div>
      </div>
      <div className="gui-body">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
