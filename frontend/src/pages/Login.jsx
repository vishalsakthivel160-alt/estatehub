import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

const dashboardPathFor = (role) => {
  if (role === 'seller') return '/seller/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/buyer/dashboard';
};

const Login = () => {
  const { login, googleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form);
      const redirectTo = location.state?.from || dashboardPathFor(user.role);
      navigate(redirectTo);
    } catch (err) {
      console.error('Login error details:', err);
      const serverMsg = err.response?.data?.message;
      const statusText = err.response?.status ? ` (HTTP ${err.response.status})` : '';
      const networkMsg = err.message ? `: ${err.message}` : '';
      setError(serverMsg || `Login failed${statusText}${networkMsg}`);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setError('');
    try {
      const user = await googleLogin({
        accessToken: tokenResponse.access_token,
        role,
      });
      const redirectTo = location.state?.from || dashboardPathFor(user.role);
      navigate(redirectTo);
    } catch (err) {
      console.error('Google login error:', err);
      const serverMsg = err.response?.data?.message;
      setError(serverMsg || 'Google login failed. Please try again.');
    }
  };

  const handleGoogleError = (err) => {
    setError(err.message || 'Google authentication failed.');
  };

  return (
    <div className="container-page py-16 flex justify-center">
      <div className="card p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome Back</h1>
        <p className="text-slate-500 text-sm mb-6">Login to your EstateHub account</p>

        {error && <p className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</p>}

        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            1. Select Account Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                role === 'buyer' ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              I'm a Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                role === 'seller' ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              I'm a Seller
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-medium">Or login with email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email address"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Don't have an account? <Link to="/register" className="text-primary-600 font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

