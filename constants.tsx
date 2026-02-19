
export const CIGUDEG_COORDS = {
  lat: -6.5477137,
  lng: 106.5326761,
  radius: 100 // meters
};

export const SPREADSHEET_ID = "1v-QJhJrWbu55-6qOOLoob23SYHkuDQB8k7HHr2Fu-kQ";
// Ganti URL ini dengan URL Web App hasil Deploy Google Apps Script Anda
export const GAS_WEBAPP_URL = "https://script.google.com/macros/s/YOUR_DEPLOY_ID/exec";

export const RAINBOW_COLORS = [
  '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'
];

export const MOCK_USERS = [
  { 
    id: '1', 
    username: 'Administator', 
    password: 'admin@123', 
    role: 'ADMIN', 
    name: 'Administrator Utama', 
    nip: '197001012023011001', 
    institutionId: 'inst-1', 
    position: 'Kepala IT/Admin' 
  },
  { 
    id: '2', 
    username: 'pegawai', 
    password: 'password', 
    role: 'PEGAWAI', 
    name: 'Asep Sunandar', 
    nip: '198505052015031002', 
    institutionId: 'inst-1', 
    position: 'Staff Pelaksana' 
  },
];

export const APP_NAME = "SICAKEP";
export const APP_FULL_NAME = "Sistem Catatan Kehadiran Pegawai";

export const BERAKHLAK_QUESTIONS = [
  { id: 'bp', label: 'Berorientasi Pelayanan', desc: 'Komitmen memberikan pelayanan prima demi kepuasan masyarakat' },
  { id: 'ak', label: 'Akuntabel', desc: 'Bertanggung jawab atas kepercayaan yang diberikan' },
  { id: 'ko', label: 'Kompeten', desc: 'Terus belajar dan mengembangkan kapabilitas' },
  { id: 'ha', label: 'Harmonis', desc: 'Saling peduli dan menghargai perbedaan' },
  { id: 'lo', label: 'Loyal', desc: 'Berdedikasi dan mengutamakan kepentingan Bangsa dan Negara' },
  { id: 'ad', label: 'Adaptif', desc: 'Terus berinovasi dan antusias dalam menggerakkan ataupun menghadapi perubahan' },
  { id: 'kl', label: 'Kolaboratif', desc: 'Membangun kerja sama yang sinergis' }
];
