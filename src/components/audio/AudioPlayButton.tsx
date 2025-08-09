import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '../ui/button';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

interface AudioPlayButtonProps {
  audioUrl: string;
  title: string;
  description?: string;
  thumbnail?: string;
  resourceId: string;
}

export const AudioPlayButton: React.FC<AudioPlayButtonProps> = ({
  audioUrl,
  title,
  description,
  thumbnail,
  resourceId
}) => {
  const { currentTrack, isPlaying, playTrack } = useAudioPlayer();
  
  const isCurrentTrack = currentTrack?.id === resourceId;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handlePlay = () => {
    playTrack({
      id: resourceId,
      url: audioUrl,
      title,
      description,
      thumbnail
    });
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <Button
        onClick={handlePlay}
        className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
      >
        {isCurrentlyPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {title}
        </div>
        {description && (
          <div className="text-xs text-gray-500 truncate mt-1">
            {description}
          </div>
        )}
        <div className="text-xs text-blue-600 mt-1">
          {isCurrentlyPlaying ? 'Reproduciendo...' : 'Click para reproducir'}
        </div>
      </div>
    </div>
  );
};
