import { motion } from 'motion/react';
import { Copy, Gift as GiftIcon } from 'lucide-react';
import { useState } from 'react';
import { useWedding } from '../context/WeddingContext';

export default function Gift() {
  const [copied, setCopied] = useState<string | null>(null);
  const { data } = useWedding();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!data.bank_bca && !data.bank_mandiri) return null;

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
        <GiftIcon size={48} className="mx-auto text-secondary mb-6" />
        <h2 className="font-script text-5xl mb-4 text-secondary">Wedding Gift</h2>
        <p className="text-sm opacity-80 mb-12">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
          Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
        </p>

        <div className="space-y-6">
          {/* Bank BCA */}
          {data.bank_bca && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="font-serif text-2xl font-bold mb-2 text-secondary">BCA</h3>
              <p className="text-xl tracking-widest mb-1 font-mono">{data.bank_bca}</p>
              <button
                onClick={() => handleCopy(data.bank_bca, 'bca')}
                className="flex items-center justify-center gap-2 mx-auto bg-secondary text-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition-colors"
              >
                <Copy size={16} />
                {copied === 'bca' ? 'Tersalin!' : 'Salin No. Rekening'}
              </button>
            </div>
          )}

          {/* Bank Mandiri */}
          {data.bank_mandiri && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="font-serif text-2xl font-bold mb-2 text-secondary">Mandiri</h3>
              <p className="text-xl tracking-widest mb-1 font-mono">{data.bank_mandiri}</p>
              <button
                onClick={() => handleCopy(data.bank_mandiri, 'mandiri')}
                className="flex items-center justify-center gap-2 mx-auto bg-secondary text-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition-colors"
              >
                <Copy size={16} />
                {copied === 'mandiri' ? 'Tersalin!' : 'Salin No. Rekening'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
