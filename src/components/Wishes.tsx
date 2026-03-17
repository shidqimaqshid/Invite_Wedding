import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useWedding } from '../context/WeddingContext';

interface Wish {
  id: number | string;
  name: string;
  message: string;
  attendance: string;
  created_at: string;
}

export default function Wishes() {
  const { data } = useWedding();
  const { slug } = useParams();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState('Hadir');

  useEffect(() => {
    const fetchWishes = async () => {
      if (!slug) {
        setWishes([
          {
            id: 1,
            name: 'Budi Santoso',
            message: `Selamat menempuh hidup baru ${data.bride.nickname} & ${data.groom.nickname}. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.`,
            attendance: 'Hadir',
            created_at: new Date().toISOString()
          }
        ]);
        return;
      }

      setIsFetching(true);
      try {
        const response = await fetch(`/api/wishes/${slug}`);
        if (response.ok) {
          const result = await response.json();
          setWishes(result.wishes || []);
        }
      } catch (error) {
        console.error('Error fetching wishes:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchWishes();
  }, [slug, data.bride.nickname, data.groom.nickname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    const newWish: Wish = {
      id: Date.now(),
      name,
      message,
      attendance,
      created_at: new Date().toISOString()
    };

    if (slug) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/wishes/${slug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, message, attendance }),
        });

        if (response.ok) {
          setWishes([newWish, ...wishes]);
          setName('');
          setMessage('');
          setAttendance('Hadir');
          alert('Terima kasih atas ucapan dan doanya!');
        } else {
          alert('Gagal mengirim pesan.');
        }
      } catch (error) {
        console.error('Error submitting wish:', error);
        alert('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setWishes([newWish, ...wishes]);
      setName('');
      setMessage('');
      setAttendance('Hadir');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section className="py-24 px-6 bg-bg text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        <h2 className="font-script text-5xl text-primary mb-4">RSVP & Wishes</h2>
        <p className="text-sm text-gray-600 mb-12">
          Kirimkan doa dan konfirmasi kehadiran Anda untuk acara pernikahan kami.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl mb-12 text-left border border-primary/10">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="attendance" className="block text-sm font-semibold text-primary mb-2">Kehadiran</label>
            <select
              id="attendance"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50"
              disabled={isLoading}
            >
              <option value="Hadir">Hadir</option>
              <option value="Tidak Hadir">Tidak Hadir</option>
              <option value="Ragu-ragu">Ragu-ragu</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-semibold text-primary mb-2">Pesan & Doa</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan pesan dan doa untuk kami"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 resize-none"
              required
              disabled={isLoading}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </form>

        {/* Wish List */}
        <div className="text-left space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="font-serif text-2xl font-bold text-primary mb-6 text-center">Ucapan & Doa ({wishes.length})</h3>
          
          {isFetching ? (
            <div className="flex justify-center py-8">
              <Loader2 size={32} className="animate-spin text-primary/50" />
            </div>
          ) : wishes.length > 0 ? (
            wishes.map((wish) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-primary">{wish.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      wish.attendance === 'Hadir' ? 'bg-green-100 text-green-700' : 
                      wish.attendance === 'Tidak Hadir' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {wish.attendance}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(wish.created_at)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{wish.message}</p>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Belum ada ucapan. Jadilah yang pertama!
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
