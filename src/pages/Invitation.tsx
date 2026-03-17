import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Loader2 } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import Cover from '../components/Cover';
import Hero from '../components/Hero';
import Couple from '../components/Couple';
import Event from '../components/Event';
import Gallery from '../components/Gallery';
import Wishes from '../components/Wishes';
import Gift from '../components/Gift';
import Footer from '../components/Footer';
import AudioPlayer from '../components/AudioPlayer';

export default function Invitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState<string>('');
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data, loadBySlug } = useWedding();

  const params = new URLSearchParams(window.location.search);
  const isBuilderPreview = params.get('mode') === 'builder';

  useEffect(() => {
    const to = params.get('to');
    if (to) {
      setGuestName(to);
    }

    if (slug) {
      setIsLoadingConfig(true);
      loadBySlug(slug).finally(() => setIsLoadingConfig(false));
    }
  }, [slug, loadBySlug]);

  const handleOpen = () => {
    setIsOpen(true);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }, [isOpen]);

  if (isLoadingConfig) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-primary">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-serif text-lg animate-pulse">Mempersiapkan Undangan...</p>
      </div>
    );
  }

  // Template Logic
  const renderTemplate = () => {
    const tId = data.template_id || 1;
    
    return (
      <div className={`relative z-0 template-${tId}`}>
        <Hero />
        <Couple />
        <Event />
        {/* Template 1 is basic, no gallery. Template 2+ has gallery */}
        {tId >= 2 && <Gallery />}
        <Gift />
        <Wishes />
        <Footer />
      </div>
    );
  };

  return (
    <div className={`relative min-h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden template-${data.template_id || 1}`}>
      {isBuilderPreview && (
        <button
          onClick={() => navigate('/builder')}
          className="fixed top-4 left-4 z-[60] bg-white/80 backdrop-blur-sm text-primary p-2 rounded-full shadow-md hover:bg-white transition-colors"
          title="Kembali ke Editor"
        >
          <Edit size={20} />
        </button>
      )}

      <AnimatePresence>
        {!isOpen && (
          <Cover key="cover" guestName={guestName} onOpen={handleOpen} />
        )}
      </AnimatePresence>

      {isOpen && renderTemplate()}
      <AudioPlayer isOpen={isOpen} />
    </div>
  );
}
