
import React, { useState } from 'react';
import { User, Institution, AttendanceType } from '../types';
import AttendanceForm from './AttendanceForm';
import LHKPModule from './LHKPModule';
import SKPModule from './SKPModule';
import PrintReportHeader from './PrintReportHeader';
import { exportToCSV, triggerPrint } from '../utils/exportUtils';

interface PegawaiDashboardProps {
  user: User;
  institution: Institution;
  showNotification?: (msg: string, type?: any) => void;
}

const PegawaiDashboard: React.FC<PegawaiDashboardProps> = ({ user, institution, showNotification }) => {
  const [activeTab, setActiveTab] = useState<'absen' | 'lhkp' | 'skp' | 'riwayat'>('absen');

  const tabs = [
    { id: 'absen', label: 'Absensi Selfie', icon: 'camera' },
    { id: 'lhkp', label: 'Laporan LHKP', icon: 'tasks' },
    { id: 'skp', label: 'Sasaran SKP', icon: 'bullseye' },
    { id: 'riwayat', label: 'Riwayat & Cetak', icon: 'print' },
  ];

  const handleExportLHKP = () => {
    const lhkpData = [
      { Tanggal: '12 Des 2023', Kegiatan: 'Koordinasi Lapangan', Lokasi: 'Cigudeg', Durasi: '2.5 Jam', Status: 'Terverifikasi' },
      { Tanggal: '13 Des 2023', Kegiatan: 'Input Data', Lokasi: 'Kantor', Durasi: '4 Jam', Status: 'Terverifikasi' },
    ];
    exportToCSV(lhkpData, `LHKP_${user.name}`);
    showNotification?.("LHKP berhasil diekspor.", "success");
  };

  const sharedProps = { showNotification };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Selamat Datang, {user.name}</h2>
          <p className="text-slate-500">{user.position} • {institution.name}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Hari Ini</p>
            <p className="text-sm font-semibold text-slate-700">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 no-print">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
              activeTab === tab.id 
                ? 'bg-white border-blue-500 text-blue-600 shadow-md transform -translate-y-1' 
                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
            }`}
          >
            <i className={`fas fa-${tab.icon} text-xl`}></i>
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="glass-card rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
        {/* Hidden Print Content logic */}
        <PrintReportHeader institution={institution} title={`LAPORAN ${activeTab.toUpperCase()} PEGAWAI`} />
        
        <div className="print-only mb-8 text-sm px-8">
           <p><strong>Nama:</strong> {user.name}</p>
           <p><strong>NIP:</strong> {user.nip}</p>
           <p><strong>Jabatan:</strong> {user.position}</p>
        </div>

        {activeTab === 'absen' && <AttendanceForm user={user} institution={institution} {...sharedProps} />}
        {activeTab === 'lhkp' && <LHKPModule user={user} {...sharedProps} />}
        {activeTab === 'skp' && <SKPModule user={user} institution={institution} {...sharedProps} />}
        {activeTab === 'riwayat' && (
          <div className="p-12 text-center no-print">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                <i className="fas fa-file-invoice"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Pusat Laporan Mandiri</h3>
              <p className="text-slate-500 mb-8 text-sm">Download rekapitulasi kehadiran dan kinerja harian Anda dalam format PDF resmi atau Excel.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={triggerPrint}
                  className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02]"
                >
                   <i className="fas fa-file-pdf text-red-400"></i> CETAK / UNDUH LAPORAN (PDF)
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleExportLHKP}
                    className="bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg text-xs"
                  >
                    <i className="fas fa-file-excel"></i> EKSPOR LHKP
                  </button>
                  <button 
                    onClick={() => exportToCSV([], 'Absensi_' + user.name)}
                    className="bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg text-xs"
                  >
                    <i className="fas fa-table"></i> EKSPOR ABSENSI
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="print-only mt-12 text-right px-8">
          <div className="inline-block text-center mr-12">
            <p className="text-sm mb-16">Mengetahui,<br/>Pimpinan Unit</p>
            <p className="text-sm font-bold underline">{institution.leader}</p>
            <p className="text-xs">NIP. {institution.nip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PegawaiDashboard;
