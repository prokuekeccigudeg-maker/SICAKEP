
import React, { useState } from 'react';
import { User } from '../types';

interface LHKPModuleProps {
  user: User;
  showNotification?: (msg: string, type?: any) => void;
}

const LHKPModule: React.FC<LHKPModuleProps> = ({ user, showNotification }) => {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<any[]>([
    { id: '1', date: '2023-12-12', startTime: '08:00', endTime: '10:30', duration: '2.5 Jam', activity: 'Koordinasi Lapangan Pengecekan Irigasi', status: 'Terverifikasi' }
  ]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    activity: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activity || !formData.startTime || !formData.endTime) {
      showNotification?.("Mohon lengkapi data kegiatan!", "warning");
      return;
    }
    
    const newRecord = {
      id: Date.now().toString(),
      ...formData,
      duration: 'Dihitung',
      status: 'Menunggu Verifikasi'
    };
    
    setRecords([newRecord, ...records]);
    showNotification?.("Kegiatan LHKP berhasil disimpan.", "success");
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus laporan kegiatan ini?")) {
      setRecords(records.filter(r => r.id !== id));
      showNotification?.("Laporan kegiatan dihapus.", "info");
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8 no-print">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">LHKP</h3>
          <p className="text-slate-500 text-sm">Laporan Harian Kinerja Pegawai</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-700 transition-all flex items-center gap-2"
        >
          <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i>
          {showForm ? 'Batal' : 'Input Kegiatan'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSave} className="bg-slate-50 rounded-3xl p-8 border border-slate-200 max-w-2xl mx-auto space-y-6 no-print animate-bounce-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Tanggal</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm"
                  value={formData.startTime}
                  onChange={e => setFormData({...formData, startTime: e.target.value})}
                  required
                />
              </div>
               <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Selesai</label>
                <input
                  type="time"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm"
                  value={formData.endTime}
                  onChange={e => setFormData({...formData, endTime: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Deskripsi Kegiatan</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white h-32 text-sm"
              placeholder="Detail pekerjaan..."
              value={formData.activity}
              onChange={e => setFormData({...formData, activity: e.target.value})}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-black text-lg shadow-xl hover:bg-emerald-700 transition-all"
          >
            SIMPAN KEGIATAN
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-lg">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kegiatan</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Belum ada data kegiatan</td>
                </tr>
              ) : (
                records.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">{record.date}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800 leading-tight">{record.activity}</p>
                      <p className="text-[10px] text-slate-400 uppercase mt-1 font-mono">{record.startTime} - {record.endTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${record.status === 'Terverifikasi' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right no-print">
                      <button 
                        onClick={() => handleDelete(record.id)} 
                        className="text-slate-300 hover:text-red-600 p-2 transition-colors"
                        title="Hapus Kegiatan"
                      >
                         <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LHKPModule;
