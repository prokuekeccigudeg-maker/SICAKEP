
import React, { useState } from 'react';

interface AdminLHKPVerificationProps {
  showNotification?: (msg: string, type?: any) => void;
}

const AdminLHKPVerification: React.FC<AdminLHKPVerificationProps> = ({ showNotification }) => {
  const [pendingLhkp, setPendingLhkp] = useState([
    { id: '1', name: 'Budi Setiawan', position: 'Staff Admin', activity: 'Pengolahan Data Penduduk RW 04', date: '12 Des 2023', time: '09:00 - 12:00', duration: '3 Jam', photo: 'https://picsum.photos/seed/101/300/300' },
    { id: '2', name: 'Ani Wijaya', position: 'Sekretaris', activity: 'Penyusunan Laporan Bulanan Kecamatan', date: '12 Des 2023', time: '13:00 - 15:00', duration: '2 Jam', photo: 'https://picsum.photos/seed/102/300/300' },
    { id: '3', name: 'Asep Sunandar', position: 'Staff Pelaksana', activity: 'Monitoring Kebersihan Pasar Cigudeg', date: '12 Des 2023', time: '08:00 - 11:00', duration: '3 Jam', photo: 'https://picsum.photos/seed/103/300/300' },
  ]);

  const handleAction = (id: string, action: 'verify' | 'reject', name: string) => {
    if (action === 'reject') {
      if (!window.confirm(`Yakin ingin menolak LHKP dari ${name}?`)) return;
    }
    
    setPendingLhkp(prev => prev.filter(item => item.id !== id));
    
    if (action === 'verify') {
      showNotification?.(`LHKP ${name} telah disetujui.`, 'success');
    } else {
      showNotification?.(`LHKP ${name} telah ditolak.`, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Verifikasi LHKP</h2>
          <p className="text-slate-500 text-sm">Validasi laporan kinerja harian pegawai</p>
        </div>
        <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 flex items-center gap-2">
           <i className="fas fa-hourglass-half text-orange-500 text-xs"></i>
           <span className="text-xs font-bold text-orange-700 uppercase tracking-tighter">{pendingLhkp.length} Menunggu</span>
        </div>
      </div>

      {pendingLhkp.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center">
           <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className="fas fa-check"></i>
           </div>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Seluruh laporan telah diproses</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingLhkp.map(item => (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col sm:flex-row gap-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              {/* Vertical accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="sm:w-28 shrink-0">
                 <img src={item.photo} className="w-full aspect-square object-cover rounded-2xl ring-4 ring-slate-50 shadow-inner" alt="Bukti Kegiatan" />
              </div>
              
              <div className="flex-1 min-w-0 space-y-3">
                 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="min-w-0">
                       <h4 className="font-bold text-slate-800 leading-tight truncate sm:whitespace-normal">{item.activity}</h4>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase bg-slate-100 px-2 py-0.5 rounded-md">{item.name}</span>
                          <span className="text-[9px] text-slate-400 font-medium italic">{item.position}</span>
                       </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-[10px] font-bold text-slate-600 tracking-tighter uppercase">{item.date}</p>
                      <p className="text-[9px] text-slate-400 font-mono">{item.time} ({item.duration})</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-2 justify-end pt-2 no-print border-t border-slate-50">
                    <button 
                      onClick={() => handleAction(item.id, 'reject', item.name)}
                      className="px-4 py-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all text-[10px] font-bold uppercase tracking-widest"
                      title="Hapus/Tolak"
                    >
                      <i className="fas fa-trash-alt mr-2"></i> Tolak
                    </button>
                    <button 
                      onClick={() => handleAction(item.id, 'verify', item.name)}
                      className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center gap-2"
                    >
                      <i className="fas fa-check-double"></i> Verifikasi
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center py-6 no-print">
         <button className="text-slate-300 font-bold hover:text-slate-500 transition-all uppercase tracking-[0.2em] text-[8px]">
           Lihat Riwayat Bulanan <i className="fas fa-chevron-right ml-1"></i>
         </button>
      </div>
    </div>
  );
};

export default AdminLHKPVerification;
