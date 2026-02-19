
import React, { useState, useEffect } from 'react';
import { exportToCSV, triggerPrint } from '../utils/exportUtils';
import { Institution } from '../types';

interface AdminAttendanceMonitorProps {
  institution?: Institution;
  showNotification?: (msg: string, type?: any) => void;
}

const AdminAttendanceMonitor: React.FC<AdminAttendanceMonitorProps> = ({ institution, showNotification }) => {
  const [showManual, setShowManual] = useState(false);
  const [selectedUserHistory, setSelectedUserHistory] = useState<any | null>(null);
  
  // Inisialisasi dari localStorage
  const [attendanceData, setAttendanceData] = useState<any[]>(() => {
    const saved = localStorage.getItem('attendance_data');
    return saved ? JSON.parse(saved) : [];
  });

  // Simpan ke localStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('attendance_data', JSON.stringify(attendanceData));
  }, [attendanceData]);

  const handleExport = () => {
    if (attendanceData.length === 0) {
      showNotification?.("Tidak ada data untuk diekspor hari ini.", "warning");
      return;
    }
    exportToCSV(attendanceData, 'Laporan_Absensi_Harian');
    showNotification?.("Laporan berhasil diekspor ke Excel.", "success");
  };

  const handleDeleteRecord = (id: string, name: string) => {
    if (window.confirm(`Hapus catatan absensi untuk ${name}?`)) {
      setAttendanceData(prev => prev.filter(item => item.id !== id));
      showNotification?.(`Catatan absensi ${name} telah dihapus.`, "info");
    }
  };

  const handleViewHistory = (item: any) => {
    setSelectedUserHistory(item);
  };

  const handleSaveManual = () => {
    showNotification?.("Absen manual berhasil disimpan ke database.", "success");
    const newEntry = {
       id: Date.now().toString(),
       name: 'Pegawai Manual',
       nip: '190000',
       status: 'Manual',
       in: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
       out: '-',
       loc: 'Kantor',
       history: [{ date: new Date().toLocaleDateString('id-ID'), in: '08:00', out: '-', status: 'Manual', loc: 'Kantor' }]
    };
    setAttendanceData([newEntry, ...attendanceData]);
    setShowManual(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Monitoring Absensi</h2>
          <p className="text-slate-500 text-sm">Kehadiran pegawai hari ini secara real-time</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={() => setShowManual(true)}
             className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2"
           >
             <i className="fas fa-keyboard"></i> Absen Manual
           </button>
           <button 
             onClick={handleExport}
             className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
           >
             <i className="fas fa-file-excel"></i> Excel
           </button>
           <button 
             onClick={triggerPrint}
             className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-slate-700 transition-all flex items-center gap-2"
           >
             <i className="fas fa-file-pdf text-red-400"></i> Unduh PDF
           </button>
        </div>
      </div>

      {/* Modal Absen Manual */}
      {showManual && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
           <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 animate-bounce-in">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold text-slate-800">Input Absen Manual</h3>
                 <button onClick={() => setShowManual(false)} className="text-slate-400 hover:text-slate-600 p-2"><i className="fas fa-times text-xl"></i></button>
              </div>
              <p className="text-xs text-slate-500">Gunakan fitur ini hanya jika pegawai mengalami kendala teknis pada perangkat pribadinya.</p>
              
              <div className="space-y-4 text-left">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Pegawai</label>
                    <input type="text" className="w-full p-3 rounded-xl border mt-1 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ketik nama pegawai..." />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipe</label>
                       <select className="w-full p-3 rounded-xl border mt-1 text-sm bg-white outline-none">
                          <option>Masuk</option>
                          <option>Pulang</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waktu</label>
                       <input type="time" className="w-full p-3 rounded-xl border mt-1 text-sm bg-white outline-none" defaultValue="08:00" />
                    </div>
                 </div>
              </div>

              <div className="flex gap-3 pt-2">
                 <button onClick={() => setShowManual(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-sm">Batal</button>
                 <button onClick={handleSaveManual} className="flex-1 py-3 rounded-xl font-bold text-white rainbow-gradient shadow-lg text-sm uppercase tracking-wider">Simpan Absen</button>
              </div>
           </div>
        </div>
      )}

      {/* Modal Detail Riwayat */}
      {selectedUserHistory && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
           <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 animate-bounce-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-4">
                 <div>
                    <h3 className="text-xl font-bold text-slate-800">Detail Riwayat Absensi</h3>
                    <p className="text-sm text-slate-500">{selectedUserHistory.name} • {selectedUserHistory.nip}</p>
                 </div>
                 <button onClick={() => setSelectedUserHistory(null)} className="text-slate-400 hover:text-slate-600 p-2"><i className="fas fa-times text-xl"></i></button>
              </div>
              
              <div className="space-y-4">
                 <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                       <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Total Hadir</p>
                       <p className="text-2xl font-black text-blue-700">{selectedUserHistory.history?.length || 0}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                       <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Terlambat</p>
                       <p className="text-2xl font-black text-orange-700">1</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                       <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Kepatuhan</p>
                       <p className="text-2xl font-black text-emerald-700">92%</p>
                    </div>
                 </div>

                 <div className="overflow-hidden border rounded-2xl">
                    <table className="w-full">
                       <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b">
                          <tr>
                             <th className="px-4 py-3 text-left">Tanggal</th>
                             <th className="px-4 py-3 text-left">Jam In / Out</th>
                             <th className="px-4 py-3 text-left">Lokasi</th>
                             <th className="px-4 py-3 text-right">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y text-xs font-medium text-slate-600">
                          {selectedUserHistory.history?.map((h: any, idx: number) => (
                             <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-bold">{h.date}</td>
                                <td className="px-4 py-3">{h.in} - {h.out}</td>
                                <td className="px-4 py-3 text-slate-400">{h.loc}</td>
                                <td className="px-4 py-3 text-right">
                                   <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${h.status === 'Terlambat' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                      {h.status}
                                   </span>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="pt-4 flex gap-3">
                 <button onClick={() => setSelectedUserHistory(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-sm">Tutup</button>
                 <button onClick={triggerPrint} className="flex-1 py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 shadow-lg text-sm flex items-center justify-center gap-2">
                    <i className="fas fa-file-pdf text-red-400"></i> Cetak Riwayat Pegawai
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Quick Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 no-print min-h-[80px]">
        {attendanceData.length === 0 ? (
          <div className="col-span-full flex items-center justify-center p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-300">
             <i className="fas fa-camera-retro mr-3 text-xl opacity-20"></i>
             <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Belum ada aktivitas absensi hari ini</p>
          </div>
        ) : (
          attendanceData.slice(0, 4).map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 group transition-all cursor-default">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden ring-2 ring-slate-50">
                   <img src={`https://picsum.photos/seed/${item.id}ava/40/40`} alt="Ava" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white">
                  <i className="fas fa-check"></i>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 leading-tight text-xs truncate">{item.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 truncate">Pukul: {item.in} WIB</p>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 ${item.status === 'Manual' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-700'} rounded-[4px] text-[8px] font-bold uppercase`}>{item.status === 'Manual' ? 'MANUAL' : 'RADIUS OK'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
           <h3 className="font-bold text-slate-800">Tabel Rekapitulasi Kehadiran</h3>
           <div className="flex gap-2">
             <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
                <input type="text" className="pl-9 pr-4 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48" placeholder="Cari nama..." />
             </div>
             <input type="date" className="px-4 py-2 rounded-xl border text-sm bg-slate-50 font-bold text-slate-600" defaultValue={new Date().toISOString().split('T')[0]} />
           </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b">
              <tr>
                <th className="px-6 py-4 text-left">Pegawai</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Masuk</th>
                <th className="px-6 py-4 text-left">Pulang</th>
                <th className="px-6 py-4 text-left">GPS/Lokasi</th>
                <th className="px-6 py-4 text-right no-print">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceData.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-300">
                         <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-200">
                           <i className="fas fa-calendar-times text-3xl opacity-20"></i>
                         </div>
                         <p className="font-bold uppercase tracking-widest text-[10px]">Hari ini belum ada absensi yang masuk</p>
                      </div>
                   </td>
                </tr>
              ) : (
                attendanceData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 group transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden no-print flex-shrink-0 flex items-center justify-center text-slate-400 border border-white">
                         <img src={`https://picsum.photos/seed/${item.id}ava/40/40`} alt="Ava" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate leading-none mb-1">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{item.nip}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 ${item.status === 'Manual' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'} rounded-lg text-[9px] font-black uppercase tracking-wider`}>
                        {item.status === 'Manual' ? 'MANUAL' : 'HADIR'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">{item.in}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">{item.out || '-'}</td>
                    <td className="px-6 py-4">
                       <p className="text-[10px] text-slate-400 font-mono truncate max-w-[100px]">{item.loc}</p>
                    </td>
                    <td className="px-6 py-4 text-right no-print">
                       <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => handleViewHistory(item)}
                            className="text-slate-300 hover:text-blue-500 p-2 transition-all"
                            title="Detail Riwayat"
                          >
                             <i className="fas fa-history"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteRecord(item.id, item.name)}
                            className="text-slate-200 hover:text-red-500 p-2 transition-all hover:scale-110"
                            title="Hapus Record"
                          >
                             <i className="fas fa-trash-alt"></i>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="print-only mt-20 text-right px-10">
        <div className="inline-block text-center">
           <p className="text-sm mb-24">Mengetahui,<br/>Pimpinan Unit</p>
           <p className="text-sm font-black underline uppercase">{institution?.leader || 'Kepala Instansi'}</p>
           <p className="text-[10px] tracking-widest mt-1">NIP. {institution?.nip || '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceMonitor;
