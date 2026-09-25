import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const dashboardPathFor = (role) => {
  if (role === 'seller') return '/seller/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/buyer/dashboard';
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <nav className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-slate-900">
          <span className="w-9 h-9 rounded-lg bg-primary-600 text-white flex items-center justify-center text-lg">🏠</span>
          Estate<span className="text-primary-600">Hub</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/properties" className={navLinkClass}>Properties</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to={dashboardPathFor(user.role)} className="btn-secondary !py-2 !px-4">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-primary !py-2 !px-4">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !py-2 !px-4">Login</Link>
              <Link to="/register" className="btn-primary !py-2 !px-4">Get Started</Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-fade-in">
          <div className="container-page flex flex-col gap-4 py-4">
            <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/properties" className={navLinkClass} onClick={() => setOpen(false)}>Properties</NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={() => setOpen(false)}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setOpen(false)}>Contact</NavLink>
            <hr className="border-slate-100" />
            {user ? (
              <>
                <Link to={dashboardPathFor(user.role)} className="btn-secondary w-full" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-primary w-full">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary w-full" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary w-full" onClick={() => setOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
