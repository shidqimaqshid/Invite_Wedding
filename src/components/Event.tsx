import { motion } from 'motion/react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export default function Event() {
  const { data } = useWedding();

  return (
    <section className="py-24 px-6 bg-primary text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/floral-motif.png")' }}></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto relative z-10"
      >
        <h2 className="font-script text-5xl mb-12 text-secondary">Save The Date</h2>

        {/* Akad */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20 shadow-xl">
          <h3 className="font-serif text-3xl font-bold mb-6 text-secondary">Akad Nikah</h3>
          
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Calendar className="text-secondary" size={20} />
              <span className="text-sm">{data.akad.date}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="text-secondary" size={20} />
              <span className="text-sm">{data.akad.time}</span>
            </div>
            <div className="flex items-start justify-center gap-3">
              <MapPin className="text-secondary mt-1" size={20} />
              <div className="text-sm text-left">
                <p className="font-bold">{data.akad.locationName}</p>
                <p className="opacity-80">{data.akad.address}</p>
              </div>
            </div>
          </div>
          
          <a href={data.akad.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-secondary text-primary font-semibold px-6 py-2 rounded-full text-sm hover:bg-white transition-colors">
            Lihat Lokasi
          </a>
        </div>

        {/* Resepsi */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
          <h3 className="font-serif text-3xl font-bold mb-6 text-secondary">Resepsi</h3>
          
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Calendar className="text-secondary" size={20} />
              <span className="text-sm">{data.resepsi.date}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="text-secondary" size={20} />
              <span className="text-sm">{data.resepsi.time}</span>
            </div>
            <div className="flex items-start justify-center gap-3">
              <MapPin className="text-secondary mt-1" size={20} />
              <div className="text-sm text-left">
                <p className="font-bold">{data.resepsi.locationName}</p>
                <p className="opacity-80">{data.resepsi.address}</p>
              </div>
            </div>
          </div>
          
          <a href={data.resepsi.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-secondary text-primary font-semibold px-6 py-2 rounded-full text-sm hover:bg-white transition-colors">
            Lihat Lokasi
          </a>
        </div>
      </motion.div>
    </section>
  );
}
