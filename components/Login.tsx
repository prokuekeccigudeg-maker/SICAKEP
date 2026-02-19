
import React, { useState } from 'react';
import { User, Role, Institution } from '../types';
import { MOCK_USERS, APP_FULL_NAME } from '../constants';

interface LoginProps {
  onLogin: (u: User) => void;
  institution: Institution;
}

const Login: React.FC<LoginProps> = ({ onLogin, institution }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (found) {
      onLogin(found as unknown as User);
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full glass-card rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl rainbow-gradient flex items-center justify-center text-white font-bold text-5xl mx-auto shadow-xl mb-4">
            C
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">SICAKEP</h1>
          <p className="text-sm text-slate-500 mt-2">{APP_FULL_NAME}</p>
          <p className="text-xs font-bold text-blue-500 mt-1 uppercase tracking-widest">{institution.name}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50"
              placeholder="Masukkan Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg rainbow-gradient hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Masuk Sekarang
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
