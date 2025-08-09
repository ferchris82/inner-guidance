import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';

interface YouTubeEmbedProps {
  videoUrl: string;
  title: string;
  description?: string;
  className?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoUrl,
  title,
  description,
  className = ""
}) => {
  // Extraer el ID del video de YouTube de diferentes formatos de URL
  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    // Si no se puede extraer el ID, mostrar enlace directo
    return (
      <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Video de YouTube</p>
          <Button 
            onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver en YouTube
          </Button>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`;
  
  // Detectar si es el modo compacto
  const isCompact = className?.includes('compact-video');
  const videoAspectRatio = isCompact ? '35%' : '56.25%'; // Un poco más grande pero aún compacto

  return (
    <div className={`bg-white rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      {/* Video Header - más compacto si es necesario */}
      <div className={`bg-gray-50 border-b border-gray-200 ${
        isCompact ? 'px-3 py-1.5' : 'px-3 py-2'
      }`}>
        <h4 className={`font-medium text-gray-900 truncate ${
          isCompact ? 'text-sm' : 'text-sm'
        }`}>{title}</h4>
        {description && !isCompact && (
          <p className="text-xs text-gray-600 line-clamp-1 mt-1">{description}</p>
        )}
      </div>
      
      {/* Video Embed - mucho más compacto */}
      <div className="relative w-full" style={{ paddingBottom: videoAspectRatio }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      {/* Video Footer - más compacto */}
      <div className={`bg-gray-50 border-t border-gray-200 ${
        isCompact ? 'px-3 py-1.5' : 'px-3 py-2'
      }`}>
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
          className={`text-xs p-1 w-full justify-center hover:bg-gray-100 ${
            isCompact ? 'h-6' : 'h-6'
          }`}
        >
          <ExternalLink className={`mr-1 ${isCompact ? 'w-3 h-3' : 'w-3 h-3'}`} />
          Ver en YouTube
        </Button>
      </div>
    </div>
  );
};
