import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useWedding } from '../context/WeddingContext';

export default function Hero() {
  const { data } = useWedding();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(data.akad.datetime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data.akad.datetime]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(249, 247, 243, 0.3), rgba(249, 247, 243, 1)), url("/images/hero.jpg")',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full max-w-md mx-auto z-10"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">
          The Wedding Of
        </p>
        
        <h1 className="font-script text-7xl md:text-8xl text-primary mb-6 drop-shadow-sm">
          {data.bride.nickname} & {data.groom.nickname}
        </h1>
        
        <p className="text-sm text-gray-600 mb-8 max-w-xs mx-auto">
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
        </p>
        <p className="text-xs font-semibold text-gray-500 mb-12">
          (QS. Ar-Rum: 21)
        </p>

        <div className="flex items-center justify-center gap-4 text-primary font-serif text-xl border-y border-primary/30 py-4 mb-8">
          <span className="font-bold text-center">{data.akad.date}</span>
        </div>

        {/* Countdown Timer */}
        <div className="flex justify-center gap-3 text-primary">
          <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-lg p-3 w-20 shadow-sm border border-primary/20">
            <span className="text-3xl font-serif font-bold">{timeLeft.days}</span>
            <span className="text-[10px] uppercase tracking-wider mt-1 font-semibold">Hari</span>
          </div>
          <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-lg p-3 w-20 shadow-sm border border-primary/20">
            <span className="text-3xl font-serif font-bold">{timeLeft.hours}</span>
            <span className="text-[10px] uppercase tracking-wider mt-1 font-semibold">Jam</span>
          </div>
          <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-lg p-3 w-20 shadow-sm border border-primary/20">
            <span className="text-3xl font-serif font-bold">{timeLeft.minutes}</span>
            <span className="text-[10px] uppercase tracking-wider mt-1 font-semibold">Menit</span>
          </div>
          <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-lg p-3 w-20 shadow-sm border border-primary/20">
            <span className="text-3xl font-serif font-bold">{timeLeft.seconds}</span>
            <span className="text-[10px] uppercase tracking-wider mt-1 font-semibold">Detik</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
