import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Spinner from './common/Spinner';

const Layout = () => {
  const { pages, role, setRole, loading } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 onClick={() => navigate('/')}>Page Builder</h1>
          <div className="role-selector">
            <span>Role:</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Admin</option>
              <option>User</option>
            </select>
          </div>
        </div>
        <nav>
          {loading ? <Spinner /> : pages.map(page => (
            <NavLink key={page._id} to={page.route}>
              {page.page_name}
            </NavLink>
          ))}
          {role === 'Admin' && (
            <NavLink to="/admin/create-page" className="create-new-link">
              <Plus size={16} className="mr-2" /> Create New Page
            </NavLink>
          )}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;