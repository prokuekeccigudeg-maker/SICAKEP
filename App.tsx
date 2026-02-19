
import React, { useState, useCallback } from 'react';
import { Role, User, Institution } from './types';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import PegawaiDashboard from './components/PegawaiDashboard';
import Navbar from './components/Navbar';
import Toast, { ToastType } from './components/Toast';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [institution, setInstitution] = useState<Institution>({
    id: 'inst-1',
    name: 'Kecamatan Cigudeg',
    address: 'Jl. Raya Cigudeg No. 1, Bogor',
    leader: 'Drs. Haji Mulyadi',
    nip: '197001011990031001',
    logo: 'https://seeklogo.com/images/K/kabupaten-bogor-logo-C39BA51261-seeklogo.com.png'
  });

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showNotification = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    showNotification(`Selamat datang kembali, ${u.name}!`, 'info');
  };

  const handleLogout = () => {
    setUser(null);
    showNotification('Anda telah keluar dari sistem.', 'warning');
  };

  if (!user) {
    return <Login onLogin={handleLogin} institution={institution} />;
  }

  const sharedProps = { showNotification };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8 pb-20">
        {user.role === Role.ADMIN ? (
          <AdminDashboard 
            admin={user} 
            institution={institution} 
            setInstitution={setInstitution}
            {...sharedProps} 
          />
        ) : (
          <PegawaiDashboard user={user} institution={institution} {...sharedProps} />
        )}
      </main>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Visual Accent */}
      <div className="fixed bottom-0 left-0 right-0 h-1 rainbow-gradient opacity-80 z-[10]" />
    </div>
  );
};

export default App;
