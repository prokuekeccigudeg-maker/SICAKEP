
import React from 'react';
import { User, Role } from '../types';
import { APP_NAME } from '../constants';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm no-print">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg rainbow-gradient flex items-center justify-center text-white font-bold text-2xl shadow-lg transform hover:scale-110 transition-transform">
            C
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">{APP_NAME}</h1>
            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Dashboard {user.role}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-slate-700">{user.name}</p>
            <p className="text-xs text-slate-500">{user.nip}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 transition-colors px-3 py-2 rounded-lg text-slate-600 font-medium text-sm"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
