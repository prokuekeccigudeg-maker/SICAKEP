
import React, { useState, useEffect, useRef } from 'react';
import { User, Role } from '../types';

interface LHKPModuleProps {
  user: User;
  showNotification?: (msg: string, type?: any) => void;
  adminMode?: boolean;
}

const LHKPModule: React.FC<LHKPModuleProps> = ({ user, showNotification, adminMode = false }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Inisialisasi dari localStorage agar data tidak hilang saat update/refresh
  const [records, setRecords] = useState<any[]>(() => {
    const saved = localStorage.getItem(`lhkp_records_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    activity: '',
    photo: '' as string,
  });

  // Simpan ke localStorage setiap kali records berubah
  useEffect(() => {
    localStorage.setItem(`lhkp_records_${user.id}`, JSON.stringify(records));
  }, [records, user.id]);

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return "";
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    let diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMinutes < 0) diffMinutes += 24 * 60; 

    const h = Math.floor(diffMinutes / 60);
    const m = diffMinutes % 60;
    
    let result = "";
    if (h > 0) result += `${h} Jam `;
    if (m > 0) result += `${m} Menit`;
    return result.trim() || "0 Menit";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // Batasi 1MB untuk localStorage
        showNotification?.("Ukuran foto terlalu besar (Maks 1MB)", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, photo: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activity || !formData.startTime || !formData.endTime) {
      showNotification?.("Mohon lengkapi data kegiatan!", "warning");
      return;
    }
    
    const duration = calculateDuration(formData.startTime, formData.endTime);
    
    if (editingId) {
      setRecords(records.map(r => r.id === editingId ? { ...r, ...formData, duration } : r));
      showNotification?.("Laporan LHKP berhasil diperbarui.", "success");
    } else {
      const newRecord = {
        id: Date.now().toString(),
        ...formData,
        duration,
        status: 'Menunggu Verifikasi'
      };
      setRecords([newRecord, ...records]);
      showNotification?.("Laporan LHKP baru berhasil disimpan.", "success");
    }
    
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      activity: '',
      photo: '',
    });
  };

  const handleEdit = (record: any) => {
    setFormData({
      date: record.date,
      startTime: record.startTime,
      endTime: record.endTime,
      activity: record.activity,
      photo: record.photo || '',
    });
    setEditingId(record.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus laporan kegiatan ini?")) {
      setRecords(records.filter(r => r.id !== id));
      showNotification?.("Laporan kegiatan telah dihapus.", "info");
    }
  };

  const handleVerify = (id: string, approve: boolean) => {
    setRecords(records.map(r => r.id === id ? { ...r, status: approve ? 'Terverifikasi' : 'Ditolak' } : r));
    showNotification?.(approve ? "Kegiatan telah diverifikasi." : "Kegiatan telah ditolak.", approve ? "success" : "warning");
  };

  return (
    <div className="p-6 md:p-8 min-h-[400px]">
      <div className="flex items-center justify-between mb-8 no-print">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">LHKP</h3>
          <p className="text-slate-500 text-sm">Laporan Harian Kinerja Pegawai</p>
        </div>
        {!adminMode && (
          <button
            onClick={() => showForm ? resetForm() : setShowForm(true)}
            className={`${showForm ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-white'} px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
          >
            <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i>
            {showForm ? 'Batal' : 'Input Kegiatan'}
          </button>
        )}
      </div>

      {showForm && !adminMode ? (
        <form onSubmit={handleSave} className="bg-slate-50 rounded-3xl p-8 border border-slate-200 max-w-2xl mx-auto space-y-6 no-print animate-bounce-in shadow-inner">
          <h4 className="text-lg font-bold text-slate-700">{editingId ? 'Edit Laporan' : 'Tambah Laporan Baru'}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Tanggal Kegiatan</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Mulai</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    required
                  />
                </div>
                 <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Selesai</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Foto Bukti Kegiatan</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative group"
              >
                {formData.photo ? (
                  <>
                    <img src={formData.photo} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                      GANTI FOTO
                    </div>
                  </>
                ) : (
                  <>
                    <i className="fas fa-image text-slate-300 text-3xl mb-2"></i>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pilih Foto (Max 1MB)</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Deskripsi Pekerjaan / Kegiatan</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white h-32 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Jelaskan secara detail apa yang dikerjakan hari ini..."
              value={formData.activity}
              onChange={e => setFormData({...formData, activity: e.target.value})}
              required
            ></textarea>
            {formData.startTime && formData.endTime && (
              <p className="mt-2 text-xs font-bold text-blue-600 uppercase tracking-tighter">
                Estimasi Durasi: {calculateDuration(formData.startTime, formData.endTime)}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-black text-lg shadow-xl hover:bg-emerald-700 transition-all uppercase tracking-widest"
          >
            {editingId ? 'SIMPAN PERUBAHAN' : 'KIRIM LAPORAN KEGIATAN'}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-lg flex flex-col min-h-[300px]">
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Foto</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Waktu & Durasi</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Detail Kegiatan</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                       <div className="flex flex-col items-center justify-center text-slate-300">
                          <i className="fas fa-file-contract text-4xl mb-4 opacity-20"></i>
                          <p className="font-bold uppercase tracking-widest text-[10px]">Belum ada laporan kegiatan hari ini</p>
                          <p className="text-[9px] mt-1 italic">Daftar kegiatan Anda akan muncul di sini</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  records.map(record => (
                    <tr key={record.id} className="hover:bg-slate-50/50 group transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden border shadow-sm">
                          {record.photo ? (
                            <img src={record.photo} className="w-full h-full object-cover" alt="Bukti" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <i className="fas fa-image text-xs"></i>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-700">{record.date}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{record.startTime} - {record.endTime}</p>
                        <p className="text-[9px] text-blue-500 font-black mt-1 uppercase tracking-tighter">{record.duration}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800 leading-snug">{record.activity}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                          record.status === 'Terverifikasi' ? 'bg-emerald-100 text-emerald-700' : 
                          record.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right no-print">
                        <div className="flex justify-end items-center gap-1">
                          {adminMode ? (
                            <>
                              <button 
                                onClick={() => handleVerify(record.id, true)}
                                className="p-2 text-emerald-400 hover:text-emerald-600 transition-colors"
                                title="Verifikasi"
                              >
                                <i className="fas fa-check-circle"></i>
                              </button>
                              <button 
                                onClick={() => handleVerify(record.id, false)}
                                className="p-2 text-red-300 hover:text-red-500 transition-colors"
                                title="Tolak"
                              >
                                <i className="fas fa-times-circle"></i>
                              </button>
                            </>
                          ) : (
                            <>
                              {record.status !== 'Terverifikasi' && (
                                <button 
                                  onClick={() => handleEdit(record)} 
                                  className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                                  title="Edit Laporan"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                              )}
                              <button 
                                onClick={() => handleDelete(record.id)} 
                                className="p-2 text-slate-200 hover:text-red-600 transition-colors"
                                title="Hapus Laporan"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LHKPModule;
