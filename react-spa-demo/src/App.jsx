import { NavLink, Route, Routes } from 'react-router-dom';
import { MultiPlayerPage } from './pages/MultiPlayerPage';
import { PageOne } from './pages/SharedPlayerPages/PageOne';
import { PageTwo } from './pages/SharedPlayerPages/PageTwo';

const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Voltax React Demo</h1>
        <p>SPA integration examples that reuse embeds across routes.</p>
        <nav className="nav-links">
          <div className="nav-links">
            <h4>Shared Player between multiple routes</h4>
          <NavLink to="/shared/page-one" className={navLinkClass}>
            Page One
          </NavLink>
          <NavLink to="/shared/page-two" className={navLinkClass}>
            Page Two
          </NavLink>
          </div>
          <div className="nav-links">
            <NavLink to="/multi" className={navLinkClass}>
            <h4>Multiple players page</h4>
            </NavLink>
          </div>
        </nav>
      </aside>
      <main className="main-panel">
        <Routes>
          <Route path="/" element={ <PageOne />} />
          <Route path="/shared/page-one" element={<PageOne />} />
          <Route path="/shared/page-two" element={<PageTwo />} />
          <Route path="/multi" element={<MultiPlayerPage />} />
        </Routes>
      </main>
    </div>
  );
}
