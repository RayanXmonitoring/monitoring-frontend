import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

console.log('Login component loaded');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  console.log('Login render');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Login form submitted:', email);
    
    try {
      await login(email, password);
      console.log('Login successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Monitoring System</h1>
          <p className="text-blue-200/70 text-sm mt-2">Login untuk mengakses dashboard</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Masukkan email"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Masukkan password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
