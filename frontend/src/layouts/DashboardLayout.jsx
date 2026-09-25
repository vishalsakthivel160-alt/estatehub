import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ title, tabs, basePath, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const activeTab = new URLSearchParams(location.search).get('tab') || tabs[0].key;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container-page py-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary self-start">Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <aside className="card p-3 h-fit">
          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                to={`${basePath}?tab=${tab.key}`}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          {children(activeTab)}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
