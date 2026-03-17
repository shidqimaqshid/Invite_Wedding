import { useState, useEffect, useRef } from 'react';
import { Disc3, Pause } from 'lucide-react';
import { motion } from 'motion/react';
import { useWedding } from '../context/WeddingContext';

interface AudioPlayerProps {
  isOpen?: boolean;
}

function getYoutubeId(url: string) {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function AudioPlayer({ isOpen = true }: AudioPlayerProps) {
  const { data } = useWedding();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  
  const ytId = getYoutubeId(data.audioUrl);

  // Handle standard audio
  useEffect(() => {
    if (ytId) {
      const currentAudio = audioRef.current;
      if (currentAudio) {
        try {
          currentAudio.pause();
          currentAudio.removeAttribute('src');
          currentAudio.load();
        } catch (e) {
          console.error('Error pausing audio:', e);
        }
        audioRef.current = null;
      }
      return;
    }

    const audio = new Audio(data.audioUrl);
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      if (audio) {
        try {
          audio.pause();
          audio.removeAttribute('src');
          audio.load();
        } catch (e) {
          console.error('Error cleaning up audio:', e);
        }
      }
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, [data.audioUrl, ytId]);

  // Handle play/pause based on isOpen and isPlaying state
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Sync actual audio players with isPlaying state
  useEffect(() => {
    if (ytId) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const command = isPlaying ? 'playVideo' : 'pauseVideo';
        try {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: command, args: [] }),
            '*'
          );
        } catch (e) {
          console.error('Error sending postMessage to YouTube iframe:', e);
        }
      }
    } else {
      const currentAudio = audioRef.current;
      if (currentAudio) {
        if (isPlaying) {
          const playPromise = currentAudio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              setIsPlaying(false);
            });
          }
        } else {
          currentAudio.pause();
        }
      }
    }
  }, [isPlaying, ytId]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {ytId && (
        <div className="hidden">
          <iframe
            ref={iframeRef}
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1&autoplay=0&controls=0&disablekb=1&fs=0&playsinline=1&loop=1&playlist=${ytId}`}
            allow="autoplay"
            title="YouTube Audio Player"
            onLoad={() => {
              // Once loaded, sync the playing state
              if (isPlaying && iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                  JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
                  '*'
                );
              }
            }}
          />
        </div>
      )}
      {isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={togglePlay}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary text-secondary rounded-full flex items-center justify-center shadow-2xl border-2 border-secondary/50 hover:scale-110 transition-transform"
        >
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <Disc3 size={24} />
            </motion.div>
          ) : (
            <Pause size={24} />
          )}
        </motion.button>
      )}
    </>
  );
}
