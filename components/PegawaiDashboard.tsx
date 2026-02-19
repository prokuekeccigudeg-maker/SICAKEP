
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
        
        <div className="print-only mb-8 text-sm">
           <p><strong>Nama:</strong> {user.name}</p>
           <p><strong>NIP:</strong> {user.nip}</p>
           <p><strong>Jabatan:</strong> {user.position}</p>
        </div>

        {activeTab === 'absen' && <AttendanceForm user={user} institution={institution} {...sharedProps} />}
        {activeTab === 'lhkp' && <LHKPModule user={user} {...sharedProps} />}
        {activeTab === 'skp' && <SKPModule user={user} institution={institution} {...sharedProps} />}
        {activeTab === 'riwayat' && (
          <div className="p-8 text-center no-print">
            <div className="max-w-md mx-auto">
              <i className="fas fa-history text-5xl text-slate-200 mb-4"></i>
              <h3 className="text-xl font-bold text-slate-700">Monitoring Laporan</h3>
              <p className="text-slate-500 mb-6 text-sm">Lihat dan unduh rekap absensi serta kinerja bulanan Anda dalam format PDF/Excel.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={triggerPrint}
                  className="bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-lg text-sm"
                >
                   <i className="fas fa-file-pdf"></i> Cetak Laporan Absensi
                </button>
                <button 
                  onClick={handleExportLHKP}
                  className="bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg text-sm"
                >
                   <i className="fas fa-file-excel"></i> Ekspor LHKP (Excel)
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="print-only mt-12 text-right">
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
