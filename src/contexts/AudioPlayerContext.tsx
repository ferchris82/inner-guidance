import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface AudioTrack {
  id: string;
  title: string;
  url: string;
  description?: string;
  thumbnail?: string;
}

interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isVisible: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playTrack = (track: AudioTrack) => {
    if (currentTrack?.id === track.id) {
      // Si es la misma pista, solo reproducir/pausar
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      // Nueva pista - resetear todo
      setCurrentTrack(track);
      setIsVisible(true);
      setIsPlaying(true);
      // El efecto de reproducción se maneja en el componente FloatingAudioPlayer
    }
  };

  const pauseTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const closePlayer = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setIsVisible(false);
    setCurrentTrack(null);
  };

  return (
    <AudioPlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      isVisible,
      audioRef,
      playTrack,
      pauseTrack,
      resumeTrack,
      closePlayer
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export { AudioPlayerContext };
