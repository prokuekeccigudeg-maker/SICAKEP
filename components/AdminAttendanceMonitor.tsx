
import React, { useState } from 'react';
import { exportToCSV, triggerPrint } from '../utils/exportUtils';
import { Institution } from '../types';

interface AdminAttendanceMonitorProps {
  institution?: Institution;
  showNotification?: (msg: string, type?: any) => void;
}

const AdminAttendanceMonitor: React.FC<AdminAttendanceMonitorProps> = ({ institution, showNotification }) => {
  const [showManual, setShowManual] = useState(false);
  // Consistent data properties using 'name'
  const [attendanceData, setAttendanceData] = useState([
    { id: '1', name: 'Asep Sunandar', nip: '19850505', status: 'Hadir', in: '08:00', out: '16:05', loc: 'Cigudeg' },
    { id: '2', name: 'Budi Setiawan', nip: '19870211', status: 'Manual', in: '08:15', out: '16:00', loc: 'Bogor' },
    { id: '3', name: 'Ani Wijaya', nip: '19920101', status: 'Hadir', in: '07:55', out: '16:10', loc: 'Cigudeg' },
    { id: '4', name: 'Dedi Kurniawan', nip: '19890412', status: 'Hadir', in: '08:02', out: '16:05', loc: 'Cigudeg' },
  ]);

  const handleExport = () => {
    exportToCSV(attendanceData, 'Laporan_Absensi_Harian');
    showNotification?.("Laporan berhasil diekspor ke Excel.", "success");
  };

  const handleDeleteRecord = (id: string, name: string) => {
    if (window.confirm(`Hapus catatan absensi untuk ${name}?`)) {
      setAttendanceData(prev => prev.filter(item => item.id !== id));
      showNotification?.(`Catatan absensi ${name} telah dihapus.`, "info");
    }
  };

  const handleSaveManual = () => {
    showNotification?.("Absen manual berhasil disimpan ke database.", "success");
    setShowManual(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Monitor Absensi Real-time</h2>
          <p className="text-slate-500">Pantau kehadiran seluruh pegawai hari ini</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={() => setShowManual(true)}
             className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2"
           >
             <i className="fas fa-keyboard"></i> Absen Manual
           </button>
           <button 
             onClick={handleExport}
             className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
           >
             <i className="fas fa-file-excel"></i> Export
           </button>
           <button 
             onClick={triggerPrint}
             className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all flex items-center gap-2"
           >
             <i className="fas fa-print"></i> Cetak
           </button>
        </div>
      </div>

      {showManual && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
           <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 animate-bounce-in">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold text-slate-800">Input Absen Manual</h3>
                 <button onClick={() => setShowManual(false)} className="text-slate-400 hover:text-slate-600 p-2"><i className="fas fa-times text-xl"></i></button>
              </div>
              <p className="text-xs text-slate-500">Fitur ini digunakan saat pegawai tidak memiliki perangkat atau kendala teknis darurat.</p>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Pegawai</label>
                    <select className="w-full p-3 rounded-xl border mt-1 text-sm bg-slate-50">
                       <option>-- Pilih Pegawai --</option>
                       <option>Asep Sunandar (198505...)</option>
                       <option>Budi Setiawan (198702...)</option>
                       <option>Ani Wijaya (199201...)</option>
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-bold text-slate-400 uppercase">Tipe</label>
                       <select className="w-full p-3 rounded-xl border mt-1 text-sm bg-slate-50">
                          <option>Masuk</option>
                          <option>Pulang</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-slate-400 uppercase">Waktu</label>
                       <input type="time" className="w-full p-3 rounded-xl border mt-1 text-sm bg-slate-50" defaultValue="08:00" />
                    </div>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setShowManual(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-sm">Batal</button>
                 <button onClick={handleSaveManual} className="flex-1 py-3 rounded-xl font-bold text-white rainbow-gradient shadow-lg text-sm uppercase tracking-wider">Simpan</button>
              </div>
           </div>
        </div>
      )}

      {/* Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {attendanceData.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-blue-200 transition-all">
            <div className="relative">
              <img src={`https://picsum.photos/seed/${item.id}att/100/100`} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-50" alt="Selfie" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white">
                <i className="fas fa-check"></i>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 leading-tight text-sm truncate">{item.name}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 truncate">MASUK: {item.in} WIB</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 ${item.status === 'Manual' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'} rounded text-[8px] font-bold uppercase`}>{item.status === 'Manual' ? 'MANUAL' : 'RADIUS OK'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
           <h3 className="font-bold text-slate-800">Riwayat Kehadiran (Tabel)</h3>
           <div className="flex gap-2">
             <input type="text" className="px-4 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Cari Pegawai..." />
             <input type="date" className="px-4 py-2 rounded-xl border text-sm bg-slate-50" defaultValue="2026-02-19" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b">
              <tr>
                <th className="px-6 py-4 text-left">Pegawai</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Masuk</th>
                <th className="px-6 py-4 text-left">Pulang</th>
                <th className="px-6 py-4 text-right no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 group transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden no-print flex-shrink-0">
                      <img src={`https://picsum.photos/seed/${item.id}ava/40/40`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.nip}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 ${item.status === 'Manual' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'} rounded-lg text-[9px] font-bold uppercase`}>
                      {item.status === 'Manual' ? 'MANUAL' : 'HADIR'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-600">{item.in}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-600">{item.out}</td>
                  <td className="px-6 py-4 text-right no-print">
                      <button 
                        onClick={() => handleDeleteRecord(item.id, item.name)}
                        className="text-slate-200 hover:text-red-500 p-2 transition-colors"
                        title="Hapus Record"
                      >
                         <i className="fas fa-trash-alt"></i>
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Signature Section */}
      <div className="print-only mt-12 text-right">
        <div className="inline-block text-center mr-12">
           <p className="text-sm mb-20">Mengetahui,<br/>Camat Cigudeg</p>
           <p className="text-sm font-bold underline uppercase">Drs. Haji Mulyadi</p>
           <p className="text-xs">NIP. 197001011990031001</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceMonitor;
