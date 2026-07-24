import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ApiError } from '../services/apiClient';

const STAFF_ROLES = ['Administrador', 'Gerente General', 'Finanzas', 'Stock'];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      const redirectTo = (location.state as { from?: { pathname: string } } | undefined)?.from?.pathname;
      const isStaff = !!user.role && STAFF_ROLES.includes(user.role.name);
      navigate(redirectTo ?? (isStaff ? '/admin' : '/home'));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="mb-6 text-center">
          <img src="/logo2.png" alt="Logo" className="h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-800">Iniciar Sesión</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-2 rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <a href="/register" className="text-primary-500 hover:underline">Crear cuenta</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
