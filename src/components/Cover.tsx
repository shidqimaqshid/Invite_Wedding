import { motion } from 'motion/react';
import { MailOpen } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

interface CoverProps {
  key?: string;
  guestName: string;
  onOpen: () => void;
}

export default function Cover({ guestName, onOpen }: CoverProps) {
  const { data } = useWedding();

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '-100%' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/images/cover.jpg")',
      }}
    >
      <div className="text-center text-white px-6 w-full max-w-md mx-auto">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm uppercase tracking-[0.2em] mb-4"
        >
          The Wedding Of
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-script text-6xl md:text-7xl mb-8"
        >
          {data.bride.nickname} & {data.groom.nickname}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <p className="text-sm mb-2">Kepada Yth.</p>
          <p className="text-sm mb-2">Bapak/Ibu/Saudara/i</p>
          <h2 className="text-2xl font-semibold mb-2">{guestName || 'Tamu Undangan'}</h2>
          <p className="text-xs italic opacity-80">*Mohon maaf bila ada kesalahan penulisan nama/gelar</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={onOpen}
          className="flex items-center justify-center gap-2 mx-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/50 text-white px-6 py-3 rounded-full transition-all duration-300"
        >
          <MailOpen size={20} />
          <span>Buka Undangan</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
