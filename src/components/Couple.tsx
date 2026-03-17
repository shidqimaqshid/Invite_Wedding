import { motion } from 'motion/react';
import { useWedding } from '../context/WeddingContext';

export default function Couple() {
  const { data } = useWedding();

  return (
    <section className="py-24 px-6 bg-bg text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        <h2 className="font-script text-5xl text-primary mb-4">Mempelai</h2>
        <p className="text-sm text-gray-600 mb-12">
          Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
          Ya Allah, perkenankanlah kami merangkaikan kasih sayang yang Kau ciptakan di antara putra-putri kami:
        </p>

        {/* Bride */}
        <div className="mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-secondary/50 shadow-xl mb-6"
          >
            <img 
              src={data.bride.photo} 
              alt={data.bride.nickname} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <h3 className="font-serif text-3xl font-bold text-primary mb-2">{data.bride.fullName}</h3>
          <p className="text-sm text-gray-600">{data.bride.parents}</p>
          <a href={`https://instagram.com/${data.bride.instagram}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline mt-2 inline-block">@{data.bride.instagram}</a>
        </div>

        <div className="font-script text-6xl text-secondary mb-16">&</div>

        {/* Groom */}
        <div className="mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-secondary/50 shadow-xl mb-6"
          >
            <img 
              src={data.groom.photo} 
              alt={data.groom.nickname} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <h3 className="font-serif text-3xl font-bold text-primary mb-2">{data.groom.fullName}</h3>
          <p className="text-sm text-gray-600">{data.groom.parents}</p>
          <a href={`https://instagram.com/${data.groom.instagram}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline mt-2 inline-block">@{data.groom.instagram}</a>
        </div>
      </motion.div>
    </section>
  );
}
