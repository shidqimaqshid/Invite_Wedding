import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface WeddingData {
  bride: {
    nickname: string;
    fullName: string;
    parents: string;
    instagram: string;
    photo: string;
  };
  groom: {
    nickname: string;
    fullName: string;
    parents: string;
    instagram: string;
    photo: string;
  };
  akad: {
    date: string;
    time: string;
    datetime: string;
    locationName: string;
    address: string;
    mapUrl: string;
  };
  resepsi: {
    date: string;
    time: string;
    locationName: string;
    address: string;
    mapUrl: string;
  };
  gallery: string[];
  audioUrl: string;
  guests: string[];
  bank_mandiri: string;
  bank_bca: string;
  template_id: number;
}

const defaultData: WeddingData = {
  bride: {
    nickname: 'Anisa',
    fullName: 'Anisa Fitriani, S.E.',
    parents: 'Putri dari Bapak Ahmad & Ibu Siti',
    instagram: 'anisafitri',
    photo: '/images/bride.jpg',
  },
  groom: {
    nickname: 'Rahma',
    fullName: 'Rahma Wijaya, S.T.',
    parents: 'Putra dari Bapak Budi & Ibu Ani',
    instagram: 'rahmawijaya',
    photo: '/images/groom.jpg',
  },
  akad: {
    date: 'Selasa, 30 Desember 2025',
    time: '08:00 WIB - Selesai',
    datetime: '2025-12-30T08:00',
    locationName: 'Masjid Raya Al-A\'zhom',
    address: 'Jl. Satria - Sudirman, Sukaasih, Kec. Tangerang, Kota Tangerang',
    mapUrl: 'https://maps.app.goo.gl/...',
  },
  resepsi: {
    date: 'Selasa, 30 Desember 2025',
    time: '11:00 WIB - 14:00 WIB',
    locationName: 'Gedung Serbaguna',
    address: 'Jl. Contoh Alamat No. 123, Kota Tangerang',
    mapUrl: 'https://maps.app.goo.gl/...',
  },
  gallery: [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
    "/images/gallery-4.jpg",
    "/images/gallery-5.jpg",
    "/images/gallery-6.jpg"
  ],
  audioUrl: '/audio/background.mp3',
  guests: [],
  bank_mandiri: '',
  bank_bca: '',
  template_id: 1,
};

interface WeddingContextType {
  data: WeddingData;
  setData: React.Dispatch<React.SetStateAction<WeddingData>>;
  isLoaded: boolean;
  loadBySlug: (slug: string) => Promise<void>;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WeddingData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user) {
      fetch('/api/invitation', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(resData => {
        if (resData.data) {
          setData({ ...defaultData, ...resData.data });
        }
      })
      .catch(console.error)
      .finally(() => setIsLoaded(true));
    } else {
      setIsLoaded(true);
    }
  }, [token, user]);

  const loadBySlug = async (slug: string) => {
    try {
      const res = await fetch(`/api/invitation/${slug}`);
      if (res.ok) {
        const resData = await res.json();
        if (resData.data) {
          setData({ ...defaultData, ...resData.data });
        }
      }
    } catch (e) {
      console.error('Failed to load invitation by slug', e);
    }
  };

  return (
    <WeddingContext.Provider value={{ data, setData, isLoaded, loadBySlug }}>
      {isLoaded ? children : <div className="min-h-screen flex items-center justify-center">Loading...</div>}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (context === undefined) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
}
