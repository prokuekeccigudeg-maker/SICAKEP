
import React, { useState, useRef, useEffect } from 'react';
import { User, Institution, AttendanceType } from '../types';
import { CIGUDEG_COORDS, GAS_WEBAPP_URL, SPREADSHEET_ID } from '../constants';

interface AttendanceFormProps {
  user: User;
  institution: Institution;
  showNotification?: (msg: string, type?: any) => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ user, institution, showNotification }) => {
  const [type, setType] = useState<AttendanceType>(AttendanceType.MASUK);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [isInRange, setIsInRange] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'capture' | 'confirm'>('capture');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const currentLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(currentLoc);
        const dist = calculateDistance(currentLoc.lat, currentLoc.lng, CIGUDEG_COORDS.lat, CIGUDEG_COORDS.lng);
        setDistance(dist);
        setIsInRange(dist <= CIGUDEG_COORDS.radius);
      }, (err) => {
        showNotification?.("Gagal mengambil lokasi. Pastikan GPS aktif.", "error");
      });
    }
    startCamera();
    return () => stopCamera();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { 
      showNotification?.("Kamera tidak dapat diakses.", "error");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setPhoto(canvas.toDataURL('image/jpeg'));
        setStep('confirm');
        stopCamera();
      }
    }
  };

  const handleSubmit = async () => {
    if (!photo || !location) {
      showNotification?.("Pastikan foto dan lokasi sudah tersedia.", "warning");
      return;
    }
    setLoading(true);

    const payload = {
      spreadsheetId: SPREADSHEET_ID,
      nama: user.name,
      nip: user.nip,
      absen: type,
      tanggal: new Date().toLocaleDateString('id-ID'),
      jam: new Date().toLocaleTimeString('id-ID'),
      foto: photo, // base64
      lokasi: `${location.lat}, ${location.lng}`,
      jarak: `${distance.toFixed(0)}m`
    };

    try {
      // Simulate API call to Google Apps Script
      console.log("Saving to Spreadsheet ID:", SPREADSHEET_ID, payload);
      
      // Real implementation would be:
      // const response = await fetch(GAS_WEBAPP_URL, { method: 'POST', body: JSON.stringify(payload) });
      // if (!response.ok) throw new Error("Server Error");

      setTimeout(() => {
        setLoading(false);
        showNotification?.(`Absensi ${type} berhasil disimpan ke Google Sheets!`, "success");
        setStep('capture');
        setPhoto(null);
        startCamera();
      }, 1500);

    } catch (error) {
      setLoading(false);
      showNotification?.("Gagal menyimpan ke Google Sheets. Coba lagi nanti.", "error");
    }
  };

  const isStrictLocation = type === AttendanceType.MASUK || type === AttendanceType.PULANG;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 space-y-4">
          <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-xl ring-4 ring-white">
            {step === 'capture' ? (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
            ) : (
              <img src={photo!} className="w-full h-full object-cover" />
            )}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold uppercase tracking-widest">
              Verifikasi Selfie
            </div>
          </div>
          {step === 'capture' ? (
            <button onClick={capturePhoto} className="w-full py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-extrabold text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-lg">
              <i className="fas fa-camera text-blue-500"></i> AMBIL FOTO
            </button>
          ) : (
            <button onClick={() => { setStep('capture'); setPhoto(null); startCamera(); }} className="w-full py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">
              Ambil Ulang
            </button>
          )}
        </div>

        <div className="md:w-1/2 space-y-6">
          <div className="grid grid-cols-2 gap-2">
            {[AttendanceType.MASUK, AttendanceType.PULANG, AttendanceType.DINAS_LUAR, AttendanceType.KENEGARAAN].map(t => (
              <button key={t} onClick={() => setType(t)} className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${type === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-400'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border space-y-4">
             <div className="flex justify-between items-center border-b pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Jarak dari Kantor:</span>
                <span className={`text-sm font-black ${isInRange || !isStrictLocation ? 'text-emerald-600' : 'text-red-600'}`}>
                  {distance.toFixed(0)}m {isInRange ? '(DALAM RADIUS)' : (isStrictLocation ? '(LUAR RADIUS)' : '')}
                </span>
             </div>
             <div className="flex justify-between items-center border-b pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Lokasi GPS:</span>
                <span className="text-[10px] font-mono text-slate-500">
                  {location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'Mencari lokasi...'}
                </span>
             </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || (isStrictLocation && isInRange === false) || !photo}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
              loading || (isStrictLocation && isInRange === false) || !photo
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'rainbow-gradient text-white hover:scale-[1.01]'
            }`}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-check-circle"></i>
            )}
            SIMPAN ABSENSI {type.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
