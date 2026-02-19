
import React, { useState } from 'react';
import { User, Role, Institution } from '../types';
import AdminUserManagement from './AdminUserManagement';
import AdminAttendanceMonitor from './AdminAttendanceMonitor';
import AdminSettings from './AdminSettings';
import AdminLHKPVerification from './AdminLHKPVerification';
import BerAKHLAKReviewModule from './BerAKHLAKReviewModule';
import PrintReportHeader from './PrintReportHeader';
import LHKPModule from './LHKPModule';

interface AdminDashboardProps {
  admin: User;
  institution: Institution;
  setInstitution: React.Dispatch<React.SetStateAction<Institution>>;
  showNotification?: (msg: string, type?: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, institution, setInstitution, showNotification }) => {
  const [activeMenu, setActiveMenu] = useState<'stats' | 'users' | 'attendance' | 'lhkp' | 'review' | 'settings' | 'schedule'>('stats');

  const menuItems = [
    { id: 'stats', label: 'Ringkasan', icon: 'chart-line', color: 'bg-blue-500' },
    { id: 'attendance', label: 'Monitor Absen', icon: 'clipboard-list', color: 'bg-orange-500' },
    { id: 'lhkp', label: 'Verifikasi LHKP', icon: 'check-double', color: 'bg-green-500' },
    { id: 'review', label: 'Review BerAKHLAK', icon: 'star', color: 'bg-pink-500' },
    { id: 'users', label: 'Kelola Pegawai', icon: 'users', color: 'bg-purple-500' },
    { id: 'schedule', label: 'Jadwal Kerja', icon: 'calendar-day', color: 'bg-teal-500' },
    { id: 'settings', label: 'Pengaturan', icon: 'cog', color: 'bg-slate-700' },
  ];

  const sharedProps = { showNotification };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar Nav */}
      <aside className="lg:col-span-3 space-y-4 no-print">
        <div className="glass-card rounded-3xl p-6 shadow-lg border border-white/50">
          <div className="flex items-center gap-4 mb-8">
             <div className="bg-white p-2 rounded-xl shadow-sm">
                <img src={institution.logo} className="w-10 h-10 object-contain" alt="Logo" />
             </div>
             <div className="min-w-0">
               <h3 className="font-bold text-slate-800 leading-tight truncate">{institution.name}</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Administrator</p>
             </div>
          </div>
          
          <div className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-sm ${
                  activeMenu === item.id 
                    ? 'bg-slate-800 text-white shadow-lg transform translate-x-2' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${activeMenu === item.id ? 'bg-white/20' : item.color} flex items-center justify-center text-white text-xs`}>
                  <i className={`fas fa-${item.icon}`}></i>
                </div>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:col-span-9 space-y-6">
        <PrintReportHeader institution={institution} title={`REKAPITULASI ${activeMenu.toUpperCase()}`} />

        {activeMenu === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Pegawai Hadir" value="42" icon="user-check" color="blue" subtitle="Hari ini" />
            <StatCard label="Terlambat" value="3" icon="clock" color="red" subtitle="Bulan ini: 12" />
            <StatCard label="Dinas Luar" value="5" icon="car" color="green" subtitle="Verifikasi pending: 2" />
            
            <div className="md:col-span-3 glass-card rounded-3xl p-8 shadow-lg no-print">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-black text-slate-800 tracking-tight">Capaian Kinerja Bulanan</h3>
                 <button className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">Unduh PDF Grafik</button>
              </div>
              <div className="h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2">
                 <i className="fas fa-chart-area text-3xl opacity-30"></i>
                 <span className="font-bold text-xs uppercase tracking-widest opacity-50">[ Grafik Statistik Pegawai ]</span>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'attendance' && <AdminAttendanceMonitor institution={institution} {...sharedProps} />}
        {activeMenu === 'lhkp' && <LHKPModule user={admin} adminMode={true} {...sharedProps} />}
        {activeMenu === 'review' && <BerAKHLAKReviewModule adminMode={true} {...sharedProps} />}
        {activeMenu === 'users' && <AdminUserManagement {...sharedProps} />}
        {activeMenu === 'schedule' && (
          <div className="glass-card rounded-3xl p-8 shadow-xl">
             <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Pengaturan Jadwal Kerja</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <h4 className="font-bold text-slate-700 border-b pb-2 text-sm uppercase tracking-widest">Jam Operasional</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jam Masuk</label>
                         <input type="time" defaultValue="08:00" className="w-full p-3 rounded-xl border mt-1 bg-slate-50 font-bold" />
                      </div>
                      <div>
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jam Pulang</label>
                         <input type="time" defaultValue="16:00" className="w-full p-3 rounded-xl border mt-1 bg-slate-50 font-bold" />
                      </div>
                   </div>
                </div>
                <div className="space-y-4">
                   <h4 className="font-bold text-slate-700 border-b pb-2 text-sm uppercase tracking-widest">Kalender Libur</h4>
                   <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl text-red-700 text-xs font-bold border border-red-100">
                         <span>25 Des - Hari Raya Natal</span>
                         <button className="text-red-300 hover:text-red-600 no-print transition-colors" onClick={() => showNotification?.("Hari libur dihapus.", "info")}><i className="fas fa-trash-alt"></i></button>
                      </div>
                      <button 
                        onClick={() => showNotification?.("Form tambah hari libur dibuka.", "info")}
                        className="w-full p-3 border-2 border-dashed rounded-xl text-slate-400 text-xs font-bold hover:bg-white transition-all no-print"
                      >
                         <i className="fas fa-calendar-plus mr-2"></i> Tambah Libur Nasional
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}
        {activeMenu === 'settings' && <AdminSettings institution={institution} setInstitution={setInstitution} {...sharedProps} />}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: string; color: string; subtitle: string }> = ({ label, value, icon, color, subtitle }) => {
  const colors: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50',
    red: 'text-red-600 bg-red-50',
    green: 'text-emerald-600 bg-emerald-50',
  };
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
      <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center mb-4 text-xl no-print shadow-inner`}>
        <i className={`fas fa-${icon}`}></i>
      </div>
      <h4 className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">{label}</h4>
      <p className="text-4xl font-black text-slate-800 mb-1 tracking-tighter">{value}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{subtitle}</p>
    </div>
  );
};

export default AdminDashboard;
