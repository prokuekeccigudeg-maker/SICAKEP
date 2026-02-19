
import React, { useState } from 'react';
import { User, Institution } from '../types';
import { triggerPrint } from '../utils/exportUtils';

interface SKPModuleProps {
  user: User;
  institution?: Institution;
  showNotification?: (msg: string, type?: any) => void;
}

const SKPModule: React.FC<SKPModuleProps> = ({ user, institution, showNotification }) => {
  const [skpTargets, setSkpTargets] = useState([
    { id: '1', title: 'Pelayanan Administrasi Umum 1', desc: 'Meningkatkan efisiensi pelayanan surat menyurat di lingkungan Kecamatan Cigudeg.', progress: 85, status: 'Aktif' },
    { id: '2', title: 'Koordinasi Keamanan Wilayah', desc: 'Melaksanakan patroli rutin bersama unsur terkait di wilayah perbatasan.', progress: 60, status: 'Aktif' },
    { id: '3', title: 'Pelaporan Kinerja Triwulan', desc: 'Menyusun laporan capaian kinerja tahunan instansi tepat waktu.', progress: 100, status: 'Selesai' },
  ]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Hapus sasaran kinerja "${title}"?`)) {
      setSkpTargets(prev => prev.filter(t => t.id !== id));
      showNotification?.(`Sasaran "${title}" telah dihapus.`, 'info');
    }
  };

  const handleAdd = () => {
    showNotification?.("Form input SKP baru akan muncul di sini.", "info");
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between no-print">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">SKP</h3>
          <p className="text-slate-500 text-sm">Sasaran Kinerja Pegawai Tahun 2024</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Input Sasaran Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skpTargets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed">
            Belum ada Sasaran Kinerja (SKP) yang diinput.
          </div>
        ) : (
          skpTargets.map(target => (
            <div key={target.id} className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative group">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${target.status === 'Selesai' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {target.status}
                </span>
                <button 
                  onClick={() => handleDelete(target.id, target.title)}
                  className="text-slate-300 hover:text-red-500 no-print transition-colors p-2"
                  title="Hapus Sasaran"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{target.title}</h4>
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
                 <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                    <span><i className="fas fa-calendar mr-1"></i> Per Semester</span>
                    <span><i className="fas fa-check-circle mr-1 text-emerald-500"></i> Terverifikasi</span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl text-center no-print">
        <p className="text-slate-500 font-bold mb-4 text-sm">Unduh hasil rekap Sasaran Kinerja (SKP) dalam format PDF resmi</p>
        <button 
          onClick={triggerPrint}
          className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center gap-2 mx-auto shadow-lg"
        >
          <i className="fas fa-file-pdf"></i> Cetak SKP PDF
        </button>
      </div>
    </div>
  );
};

export default SKPModule;
