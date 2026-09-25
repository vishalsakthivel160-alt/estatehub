import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const dashboardPathFor = (role) => {
  if (role === 'seller') return '/seller/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/buyer/dashboard';
};

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await register(form);
      navigate(dashboardPathFor(user.role));
    } catch (err) {
      console.error('Registration error details:', err);
      const serverMsg = err.response?.data?.message;
      const statusText = err.response?.status ? ` (HTTP ${err.response.status})` : '';
      const networkMsg = err.message ? `: ${err.message}` : '';
      setError(serverMsg || `Registration failed${statusText}${networkMsg}`);
    }
  };

  return (
    <div className="container-page py-16 flex justify-center">
      <div className="card p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Create Your Account</h1>
        <p className="text-slate-500 text-sm mb-6">Join EstateHub as a buyer or seller</p>

        {error && <p className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Full name"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email address"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Phone number"
            className="input-field"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            required
            type="password"
            placeholder="Password (min 6 characters)"
            minLength={6}
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'buyer' })}
              className={`py-2.5 rounded-lg border text-sm font-medium ${
                form.role === 'buyer' ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 text-slate-600'
              }`}
            >
              I'm a Buyer
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'seller' })}
              className={`py-2.5 rounded-lg border text-sm font-medium ${
                form.role === 'seller' ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 text-slate-600'
              }`}
            >
              I'm a Seller
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Already have an account? <Link to="/login" className="text-primary-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
