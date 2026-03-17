import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, Link, Trash2, Plus, Loader2, Upload, LogOut } from 'lucide-react';
import localforage from 'localforage';

export default function Builder() {
  const { data, setData } = useWedding();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [newGuest, setNewGuest] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFileUpload = (section: keyof typeof data, field: string, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange(section, field, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAudioUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setData({ ...data, audioUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (section: keyof typeof data, field: string, value: any) => {
    if (section === 'gallery') {
      const newGallery = [...data.gallery];
      newGallery[parseInt(field)] = value;
      setData({ ...data, gallery: newGallery });
    } else {
      setData({
        ...data,
        [section]: {
          ...(data[section] as any),
          [field]: value
        }
      });
    }
  };

  const handleAddGuest = () => {
    if (newGuest.trim()) {
      setData({
        ...data,
        guests: [...data.guests, newGuest.trim()]
      });
      setNewGuest('');
    }
  };

  const handleRemoveGuest = (index: number) => {
    const newGuests = [...data.guests];
    newGuests.splice(index, 1);
    setData({
      ...data,
      guests: newGuests
    });
  };

  const handleCopyLink = (guestName: string) => {
    const url = new URL(window.location.href);
    let link = `${url.origin}/preview?to=${encodeURIComponent(guestName)}`;
    
    if (data.googleSheetUrl) {
      try {
        const match = data.googleSheetUrl.match(/\/macros\/s\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          link += `&db=${match[1]}`;
        }
      } catch (e) {
        console.error('Error parsing googleSheetUrl for copy link:', e);
      }
    }
    
    navigator.clipboard.writeText(link).then(() => {
      alert(`Link untuk ${guestName} berhasil disalin!`);
    });
  };

  const handlePreview = () => {
    if (data.googleSheetUrl) {
      try {
        const match = data.googleSheetUrl.match(/\/macros\/s\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          navigate(`/preview?mode=builder&db=${match[1]}`);
          return;
        }
      } catch (e) {
        console.error('Error parsing googleSheetUrl for preview:', e);
      }
    }
    navigate('/preview?mode=builder');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const response = await fetch('/api/invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data })
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Gagal menyimpan data');
      }
    } catch (e) {
      console.error('Error saving to API', e);
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pembuat Undangan</h1>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-white text-primary border border-primary px-6 py-2 rounded-lg hover:bg-primary/10 transition-colors shadow-sm disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-md"
            >
              <Eye size={20} />
              Lihat Hasil
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Daftar Tamu */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-primary border-b pb-2">Daftar Tamu Undangan</h2>
            <p className="text-sm text-gray-600 mb-4">
              Tambahkan nama tamu untuk membuat link undangan khusus (publish) yang akan menampilkan nama mereka di halaman depan.
            </p>
            
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newGuest}
                onChange={(e) => setNewGuest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGuest()}
                placeholder="Nama Tamu (contoh: Budi Santoso)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={handleAddGuest}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                <Plus size={20} />
                Tambah
              </button>
            </div>

            {data.guests && data.guests.length > 0 ? (
              <div className="space-y-3">
                {data.guests.map((guest, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-800">{guest}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopyLink(guest)}
                        className="flex items-center gap-1 text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
                        title="Salin Link Undangan"
                      >
                        <Link size={16} />
                        Salin Link
                      </button>
                      <button
                        onClick={() => handleRemoveGuest(idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="Hapus Tamu"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                Belum ada tamu yang ditambahkan.
              </div>
            )}
          </div>

          {/* Mempelai Wanita */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-primary border-b pb-2">Mempelai Wanita</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  value={data.bride.nickname}
                  onChange={(e) => handleChange('bride', 'nickname', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={data.bride.fullName}
                  onChange={(e) => handleChange('bride', 'fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Orang Tua</label>
                <input
                  type="text"
                  value={data.bride.parents}
                  onChange={(e) => handleChange('bride', 'parents', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Putri dari Bapak ... & Ibu ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Instagram (tanpa @)</label>
                <input
                  type="text"
                  value={data.bride.instagram}
                  onChange={(e) => handleChange('bride', 'instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto Profil</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-center flex items-center justify-center gap-2 transition-colors">
                    <Upload size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Pilih Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('bride', 'photo', e.target.files?.[0] || null)}
                    />
                  </label>
                  {data.bride.photo && (
                    <img src={data.bride.photo} alt="Preview" className="w-10 h-10 object-cover rounded-full border border-gray-200" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mempelai Pria */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-primary border-b pb-2">Mempelai Pria</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  value={data.groom.nickname}
                  onChange={(e) => handleChange('groom', 'nickname', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={data.groom.fullName}
                  onChange={(e) => handleChange('groom', 'fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Orang Tua</label>
                <input
                  type="text"
                  value={data.groom.parents}
                  onChange={(e) => handleChange('groom', 'parents', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Putra dari Bapak ... & Ibu ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Instagram (tanpa @)</label>
                <input
                  type="text"
                  value={data.groom.instagram}
                  onChange={(e) => handleChange('groom', 'instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto Profil</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-center flex items-center justify-center gap-2 transition-colors">
                    <Upload size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Pilih Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('groom', 'photo', e.target.files?.[0] || null)}
                    />
                  </label>
                  {data.groom.photo && (
                    <img src={data.groom.photo} alt="Preview" className="w-10 h-10 object-cover rounded-full border border-gray-200" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Akad Nikah */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-primary border-b pb-2">Akad Nikah</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal (Contoh: Selasa, 30 Des 2025)</label>
                <input
                  type="text"
                  value={data.akad.date}
                  onChange={(e) => handleChange('akad', 'date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waktu (Contoh: 08:00 WIB - Selesai)</label>
                <input
                  type="text"
                  value={data.akad.time}
                  onChange={(e) => handleChange('akad', 'time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Countdown (Sistem)</label>
                <input
                  type="datetime-local"
                  value={data.akad.datetime}
                  onChange={(e) => handleChange('akad', 'datetime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Gedung/Lokasi</label>
                <input
                  type="text"
                  value={data.akad.locationName}
                  onChange={(e) => handleChange('akad', 'locationName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea
                  value={data.akad.address}
                  onChange={(e) => handleChange('akad', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={2}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps</label>
                <input
                  type="text"
                  value={data.akad.mapUrl}
                  onChange={(e) => handleChange('akad', 'mapUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Resepsi */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-primary border-b pb-2">Resepsi</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal (Contoh: Selasa, 30 Des 2025)</label>
                <input
                  type="text"
                  value={data.resepsi.date}
                  onChange={(e) => handleChange('resepsi', 'date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waktu (Contoh: 11:00 WIB - 14:00 WIB)</label>
                <input
                  type="text"
                  value={data.resepsi.time}
                  onChange={(e) => handleChange('resepsi', 'time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Gedung/Lokasi</label>
                <input
                  type="text"
                  value={data.resepsi.locationName}
                  onChange={(e) => handleChange('resepsi', 'locationName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea
                  value={data.resepsi.address}
                  onChange={(e) => handleChange('resepsi', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={2}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps</label>
                <input
                  type="text"
                  value={data.resepsi.mapUrl}
                  onChange={(e) => handleChange('resepsi', 'mapUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Galeri */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-primary border-b pb-2">Galeri Foto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.gallery.map((url, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Foto {idx + 1}</label>
                  <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-center flex items-center justify-center gap-2 transition-colors">
                    <Upload size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Pilih Foto {idx + 1}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('gallery', idx.toString(), e.target.files?.[0] || null)}
                    />
                  </label>
                  {url && (
                    <div className="h-24 w-full rounded-md overflow-hidden border border-gray-200">
                      <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Musik Latar */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-primary border-b pb-2">Musik Latar</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Audio (MP3)</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-center flex items-center justify-center gap-2 transition-colors">
                  <Upload size={18} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Pilih File MP3</span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => handleAudioUpload(e.target.files?.[0] || null)}
                  />
                </label>
                {data.audioUrl && (
                  <div className="flex-1 text-sm text-gray-600 truncate">
                    {data.audioUrl.startsWith('data:audio') ? 'Audio berhasil di-upload' : data.audioUrl}
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Pilih file MP3 dari perangkat Anda. Musik akan otomatis diputar saat undangan dibuka.
              </p>
            </div>
          </div>

          {/* Template & Bank */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-primary border-b pb-2">Pengaturan Tambahan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Template</label>
                <select
                  value={data.template_id}
                  onChange={(e) => setData({ ...data, template_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value={1}>Template 1 (Biasa)</option>
                  <option value={2}>Template 2 (Dengan Galeri)</option>
                  <option value={3}>Template 3 (Elegan)</option>
                  <option value={4}>Template 4 (Minimalis)</option>
                  <option value={5}>Template 5 (Floral)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Rekening Mandiri</label>
                <input
                  type="text"
                  value={data.bank_mandiri}
                  onChange={(e) => setData({ ...data, bank_mandiri: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Contoh: 1234567890 a.n Budi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Rekening BCA</label>
                <input
                  type="text"
                  value={data.bank_bca}
                  onChange={(e) => setData({ ...data, bank_bca: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Contoh: 0987654321 a.n Ani"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
