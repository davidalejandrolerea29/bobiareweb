import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Usamos el login después de crear la cuenta
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Crear cuenta en Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      // Si la cuenta se crea correctamente, automáticamente hacer login y redirigir al admin
      await login(email, password); // Utilizamos el login que ya tienes implementado
      navigate('/admin'); // Redirige a la pantalla de administración
    } catch (err) {
      setError('Hubo un error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="mb-6 text-center">
          <img src="/logo2.png" alt="Logo" className="h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-800">Crear Cuenta</h2>
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
            className="w-full bg-primary-500 text-white py-2 rounded-xl hover:bg-primary-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Crear Cuenta'}
          </button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <a href="#" className="text-primary-500 hover:underline">¿Olvidaste tu contraseña?</a>
          <a href="/login" className="text-primary-500 hover:underline">Iniciar sesión</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
