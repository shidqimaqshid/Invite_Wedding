import { motion } from 'motion/react';
import { useWedding } from '../context/WeddingContext';

export default function Footer() {
  const { data } = useWedding();

  return (
    <footer className="py-12 px-6 bg-primary text-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        <p className="text-sm mb-4">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
        </p>
        <p className="text-sm font-semibold mb-8">Wassalamu'alaikum Warahmatullahi Wabarakatuh</p>
        
        <h2 className="font-script text-5xl text-secondary mb-4">{data.bride.nickname} & {data.groom.nickname}</h2>
        
        <p className="text-xs opacity-60 mt-12">
          Made with ❤️ by AI Studio
        </p>
      </motion.div>
    </footer>
  );
}
