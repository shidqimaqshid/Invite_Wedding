import { motion } from 'motion/react';
import { useWedding } from '../context/WeddingContext';

export default function Gallery() {
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
        <h2 className="font-script text-5xl text-primary mb-4">Our Moments</h2>
        <p className="text-sm text-gray-600 mb-12">
          "Cinta bukan tentang seberapa lama kamu mengenal seseorang, tapi tentang siapa yang datang dan tidak pernah pergi."
        </p>

        <div className="grid grid-cols-2 gap-4">
          {data.gallery.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl overflow-hidden shadow-lg ${index === 0 || index === 3 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
            >
              <img 
                src={src} 
                alt={`Gallery ${index + 1}`} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
