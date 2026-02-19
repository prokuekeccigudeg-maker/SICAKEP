
import React, { useState } from 'react';
import { User, Institution } from '../types';
import { triggerPrint } from '../utils/exportUtils';

interface SKPModuleProps {
  user: User;
  institution?: Institution;
  showNotification?: (msg: string, type?: any) => void;
}

const SKPModule: React.FC<SKPModuleProps> = ({ user, institution, showNotification }) => {
  // Dimulai dengan array kosong agar admin/pegawai bisa menginput target riil
  const [skpTargets, setSkpTargets] = useState<any[]>([]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Hapus sasaran kinerja "${title}"?`)) {
      setSkpTargets(prev => prev.filter(t => t.id !== id));
      showNotification?.(`Sasaran "${title}" telah dihapus.`, 'info');
    }
  };

  const handleAdd = () => {
    const newTarget = {
       id: Date.now().toString(),
       title: 'Sasaran Kinerja Baru',
       desc: 'Deskripsi sasaran kinerja Anda...',
       progress: 0,
       status: 'Aktif'
    };
    setSkpTargets([newTarget, ...skpTargets]);
    showNotification?.("Sasaran baru berhasil ditambahkan. Silakan edit detailnya.", "info");
  };

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-[500px]">
      <div className="flex items-center justify-between no-print">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">SKP</h3>
          <p className="text-slate-500 text-sm">Sasaran Kinerja Pegawai Tahun {new Date().getFullYear()}</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2 hover:scale-105"
        >
          <i className="fas fa-plus"></i> Input Sasaran Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skpTargets.length === 0 ? (
          <div className="col-span-full py-24 text-center text-slate-300 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <i className="fas fa-bullseye text-3xl opacity-20"></i>
             </div>
             <p className="font-bold uppercase tracking-widest text-[10px]">Belum ada Sasaran Kinerja (SKP)</p>
             <p className="text-[10px] mt-1 italic text-slate-400">Klik tombol "Input Sasaran Baru" untuk memulai target tahunan Anda</p>
          </div>
        ) : (
          skpTargets.map(target => (
            <div key={target.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative group overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${target.status === 'Selesai' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {target.status}
                </span>
                <button 
                  onClick={() => handleDelete(target.id, target.title)}
                  className="text-slate-200 hover:text-red-500 no-print transition-colors p-2"
                  title="Hapus Sasaran"
                >
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
              <h4 className="font-bold text-slate-800 mb-2 truncate">{target.title}</h4>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">{target.desc}</p>
              
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 uppercase tracking-tighter">
                      <span>Progres Capaian</span>
                      <span>{target.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${target.progress}%` }}></div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span><i className="fas fa-calendar-check mr-1"></i> Per Semester</span>
                    <span><i className="fas fa-shield-alt mr-1 text-emerald-500"></i> Terverifikasi</span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-10 bg-slate-800 rounded-3xl text-center no-print shadow-xl">
        <div className="max-w-md mx-auto">
           <i className="fas fa-print text-4xl text-slate-600 mb-4"></i>
           <p className="text-white font-bold mb-2 uppercase tracking-widest text-sm">Dokumen SKP Resmi</p>
           <p className="text-slate-400 text-xs mb-6">Unduh dan cetak rekapitulasi Sasaran Kinerja Pegawai Anda dalam format PDF standar kepegawaian.</p>
           <button 
             onClick={triggerPrint}
             className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2 mx-auto shadow-lg text-sm"
           >
             <i className="fas fa-file-pdf text-red-500"></i> CETAK SKP PDF
           </button>
        </div>
      </div>
    </div>
  );
};

export default SKPModule;
