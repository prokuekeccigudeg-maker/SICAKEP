
import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AdminUserManagementProps {
  showNotification?: (msg: string, type?: any) => void;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ showNotification }) => {
  // Inisialisasi dari localStorage
  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('pegawai_users');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    position: '',
    role: 'PEGAWAI',
    username: '',
    password: ''
  });

  // Simpan ke localStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('pegawai_users', JSON.stringify(users));
  }, [users]);

  const handleToggleForm = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || '',
        nip: user.nip || '',
        position: user.position || '',
        role: user.role || 'PEGAWAI',
        username: user.username || '',
        password: user.password || ''
      });
      setShowForm(true);
    } else {
      setEditingUser(null);
      setFormData({ name: '', nip: '', position: '', role: 'PEGAWAI', username: '', password: '' });
      setShowForm(!showForm);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.nip) {
      showNotification?.("Nama dan NIP wajib diisi!", "warning");
      return;
    }
    
    if (editingUser) {
      const updatedUsers = users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u);
      setUsers(updatedUsers);
      showNotification?.(`Data pegawai ${formData.name} berhasil diperbarui!`, "success");
    } else {
      const newUser = { ...formData, id: Date.now().toString() };
      setUsers([...users, newUser]);
      showNotification?.(`Pegawai ${formData.name} berhasil ditambahkan!`, "success");
    }
    setShowForm(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus permanen akun pegawai: ${name}?`)) {
      const filteredUsers = users.filter(u => u.id !== id);
      setUsers(filteredUsers);
      showNotification?.(`Akun ${name} telah dihapus dari sistem.`, "info");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Pegawai</h2>
          <p className="text-slate-500 text-sm">Kelola akun dan data profil pegawai instansi</p>
        </div>
        <button
          onClick={() => handleToggleForm()}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-all hover:scale-105"
        >
          <i className={`fas fa-${showForm ? 'times' : 'user-plus'}`}></i>
          {showForm ? 'Batal' : 'Tambah Pegawai'}
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-3xl p-8 border-2 border-blue-100 shadow-xl space-y-6 no-print animate-bounce-in">
          <h3 className="text-xl font-bold text-slate-800">{editingUser ? 'Update Data Pegawai' : 'Input Pegawai Baru'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Nama Lengkap</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Nama tanpa gelar..." 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">NIP / NIK</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.nip}
                  onChange={e => setFormData({...formData, nip: e.target.value})}
                  placeholder="199xxx" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Jabatan</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.position}
                  onChange={e => setFormData({...formData, position: e.target.value})}
                  placeholder="Contoh: Staff Keuangan" 
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Role Akses</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="PEGAWAI">Pegawai (User)</option>
                  <option value="ADMIN">Admin (Dashboard)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Username</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  placeholder="username_login" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="****" 
                />
              </div>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl hover:bg-blue-700 transition-all uppercase tracking-widest"
          >
            {editingUser ? 'SIMPAN PERUBAHAN' : 'DAFTARKAN PEGAWAI'}
          </button>
        </div>
      )}

      <div className="glass-card rounded-3xl overflow-hidden shadow-lg border border-slate-100 min-h-[300px] flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nama & NIP</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Jabatan</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Akses</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest no-print">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300">
                       <i className="fas fa-user-slash text-5xl mb-4 opacity-20"></i>
                       <p className="font-bold uppercase tracking-widest text-[10px]">Belum ada pegawai terdaftar</p>
                       <p className="text-[10px] mt-1 italic">Gunakan tombol "Tambah Pegawai" di atas</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">{u.name || 'Nama Tidak Set'}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{u.nip || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{u.position || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-lg uppercase ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 no-print">
                      <button 
                        onClick={() => handleToggleForm(u)}
                        className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                        title="Edit Data"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-2 text-slate-200 hover:text-red-600 transition-colors"
                        title="Hapus Pegawai"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
