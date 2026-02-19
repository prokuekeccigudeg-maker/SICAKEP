
import React, { useState } from 'react';
import { BERAKHLAK_QUESTIONS } from '../constants';

interface BerAKHLAKReviewModuleProps {
  adminMode?: boolean;
}

const BerAKHLAKReviewModule: React.FC<BerAKHLAKReviewModuleProps> = ({ adminMode = false }) => {
  const [selectedPegawai, setSelectedPegawai] = useState<string>('');
  const [scores, setScores] = useState<Record<string, number>>({
    bp: 5, ak: 5, ko: 5, ha: 5, lo: 5, ad: 5, kl: 5
  });

  const handleScoreChange = (id: string, value: number) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Penilaian BerAKHLAK berhasil disimpan!`);
  };

  return (
    <div className="glass-card rounded-3xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Penilaian BerAKHLAK</h2>
          <p className="text-slate-500">Evaluasi perilaku kerja pegawai berdasarkan core values ASN</p>
        </div>
        {adminMode && (
           <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-400 uppercase">Pilih Pegawai:</label>
              <select 
                value={selectedPegawai} 
                onChange={(e) => setSelectedPegawai(e.target.value)}
                className="p-2 rounded-xl border text-sm font-bold bg-white"
              >
                <option value="">-- Pilih Pegawai --</option>
                <option value="1">Asep Sunandar</option>
                <option value="2">Budi Santoso</option>
              </select>
           </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BERAKHLAK_QUESTIONS.map(q => (
            <div key={q.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:shadow-md transition-all">
               <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                     <h4 className="font-bold text-slate-800">{q.label}</h4>
                     <p className="text-[10px] text-slate-500 leading-tight">{q.desc}</p>
                  </div>
                  <div className="text-2xl font-black text-blue-600 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                     {scores[q.id]}
                  </div>
               </div>
               <div className="mt-4 flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Skor:</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={scores[q.id]} 
                    onChange={(e) => handleScoreChange(q.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
               </div>
            </div>
          ))}
        </div>

        <div className="bg-white border-t pt-8">
           <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Catatan Perbaikan & Review</label>
              <textarea 
                className="w-full p-4 rounded-2xl border bg-slate-50 h-32 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="Berikan masukan konstruktif untuk pegawai ini..."
              ></textarea>
           </div>
           
           <button 
             type="submit" 
             disabled={!selectedPegawai && adminMode}
             className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl transition-all ${
               !selectedPegawai && adminMode ? 'bg-slate-300 cursor-not-allowed' : 'rainbow-gradient hover:scale-[1.01]'
             }`}
           >
             SIMPAN HASIL PENILAIAN
           </button>
        </div>
      </form>
    </div>
  );
};

export default BerAKHLAKReviewModule;
