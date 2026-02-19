
import React, { useState } from 'react';
import { Institution } from '../types';

interface AdminSettingsProps {
  institution: Institution;
  showNotification?: (msg: string, type?: any) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ institution, showNotification }) => {
  const [loading, setLoading] = useState(false);

  const handleSaveAll = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showNotification?.("Seluruh pengaturan instansi telah berhasil diperbarui!", "success");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="glass-card rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Pengaturan Instansi & Pimpinan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Nama Instansi</label>
              <input type="text" className="w-full p-3 rounded-xl border mt-1" defaultValue={institution.name} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Alamat Lengkap</label>
              <textarea className="w-full p-3 rounded-xl border mt-1 h-24" defaultValue={institution.address}></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Logo Instansi</label>
              <div className="flex items-center gap-4 mt-2">
                 <img src={institution.logo} className="w-16 h-16 object-contain bg-white rounded-lg border p-1" />
                 <button className="bg-slate-100 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200">Upload Logo</button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Nama Pimpinan</label>
              <input type="text" className="w-full p-3 rounded-xl border mt-1" defaultValue={institution.leader} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">NIP Pimpinan</label>
              <input type="text" className="w-full p-3 rounded-xl border mt-1" defaultValue={institution.nip} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Jabatan Pimpinan</label>
              <input type="text" className="w-full p-3 rounded-xl border mt-1" defaultValue="Camat Cigudeg" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-car text-blue-500"></i> Pengaturan Dinas Luar
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border">
               <div>
                 <p className="font-bold text-slate-700">Opsi Setengah Hari</p>
                 <p className="text-xs text-slate-400">Izinkan input DL durasi singkat</p>
               </div>
               <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border">
               <div>
                 <p className="font-bold text-slate-700">Opsi Full Day</p>
                 <p className="text-xs text-slate-400">Absensi DL berlaku seharian penuh</p>
               </div>
               <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-calendar-alt text-teal-500"></i> Hari Kerja & Libur
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
             {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => (
               <label key={day} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border cursor-pointer hover:bg-white">
                 <input type="checkbox" defaultChecked={day !== 'Sab' && day !== 'Min'} />
                 <span className="text-xs font-bold">{day}</span>
               </label>
             ))}
          </div>
          <button className="w-full p-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all">Atur Tanggal Libur Spesifik</button>
        </div>
      </div>

      <button 
        onClick={handleSaveAll}
        disabled={loading}
        className="w-full py-4 rounded-2xl rainbow-gradient text-white font-black text-lg shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
      >
        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
        SIMPAN SEMUA PENGATURAN INSTANSI
      </button>
    </div>
  );
};

export default AdminSettings;
