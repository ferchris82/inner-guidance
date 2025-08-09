// Tipos y configuraciones para los recursos (podcasts y videos)

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'podcast' | 'youtube' | 'pdf' | 'audio' | 'video_series' | 'study';
  url: string;
  thumbnail_url?: string;
  featured: boolean;
  order_index: number;
  active: boolean;
  metadata?: {
    duration?: string;
    episode_number?: number;
    series_name?: string;
    author?: string;
    file_size?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateResourceData {
  title: string;
  description: string;
  type: ResourceItem['type'];
  url: string;
  thumbnail_url?: string;
  featured: boolean;
  order_index: number;
  active: boolean;
  metadata?: ResourceItem['metadata'];
}

// Configuración para los diferentes tipos de recursos
export const resourceTypeConfig = {
  podcast: {
    icon: 'Headphones',
    label: 'Podcast',
    color: 'bg-purple-500',
    description: 'Episodios de podcast espirituales',
    placeholder: {
      url: 'https://open.spotify.com/episode/...',
      title: 'Caminando en Propósito - Episodio 15',
      description: 'En este episodio exploramos cómo descubrir y caminar en nuestro propósito divino...'
    }
  },
  youtube: {
    icon: 'Video',
    label: 'Video YouTube',
    color: 'bg-red-500',
    description: 'Videos de enseñanza de YouTube',
    placeholder: {
      url: 'https://www.youtube.com/watch?v=...',
      title: 'Descubriendo tu Identidad en Cristo',
      description: 'Video enseñanza sobre cómo encontrar nuestra verdadera identidad en Cristo...'
    }
  },
  pdf: {
    icon: 'FileText',
    label: 'Documento PDF',
    color: 'bg-blue-500',
    description: 'Guías y estudios en PDF',
    placeholder: {
      url: '/resources/guia-oracion-profetica.pdf',
      title: 'Guía de Oración Profética',
      description: 'Manual completo para desarrollar tu vida de oración...'
    }
  },
  audio: {
    icon: 'Headphones',
    label: 'Audio/Meditación',
    color: 'bg-green-500',
    description: 'Audios de meditación y enseñanza',
    placeholder: {
      url: '/resources/meditacion-guiada.mp3',
      title: 'Meditación: Intimidad con Dios',
      description: 'Audio meditación para profundizar tu relación con Dios...'
    }
  },
  video_series: {
    icon: 'Video',
    label: 'Serie de Videos',
    color: 'bg-indigo-500',
    description: 'Serie completa de videos de enseñanza',
    placeholder: {
      url: 'https://youtube.com/playlist?list=...',
      title: 'Serie: Descubriendo tu Propósito',
      description: '5 videos de enseñanza sobre propósito divino...'
    }
  },
  study: {
    icon: 'BookOpen',
    label: 'Estudio Bíblico',
    color: 'bg-amber-500',
    description: 'Estudios bíblicos estructurados',
    placeholder: {
      url: '/resources/estudio-identidad-cristo.pdf',
      title: 'Estudio: Identidad en Cristo',
      description: 'Estudio bíblico de 8 semanas sobre identidad espiritual...'
    }
  }
};

// Utilidades para validar URLs
export const validateUrl = (url: string, type: ResourceItem['type']): boolean => {
  try {
    const urlObj = new URL(url);
    
    switch (type) {
      case 'podcast':
        return urlObj.hostname.includes('spotify.com') || 
               urlObj.hostname.includes('apple.com') || 
               urlObj.hostname.includes('podcasts.google.com') ||
               urlObj.hostname.includes('podcasts.google') ||
               urlObj.hostname.includes('anchor.fm') ||
               urlObj.hostname.includes('soundcloud.com') ||
               urlObj.hostname.includes('castbox.fm') ||
               urlObj.hostname.includes('overcast.fm') ||
               urlObj.hostname.includes('pocketcasts.com') ||
               urlObj.pathname.endsWith('.mp3') ||
               urlObj.pathname.endsWith('.m4a');
      
      case 'youtube':
        return urlObj.hostname.includes('youtube.com') || 
               urlObj.hostname.includes('youtu.be');
      
      case 'pdf':
        return urlObj.pathname.endsWith('.pdf') || urlObj.hostname.length > 0;
      
      case 'audio':
        return urlObj.pathname.endsWith('.mp3') || 
               urlObj.pathname.endsWith('.wav') || 
               urlObj.pathname.endsWith('.m4a') ||
               urlObj.hostname.length > 0;
      
      case 'video_series':
        return urlObj.hostname.includes('youtube.com') || 
               urlObj.hostname.includes('vimeo.com') ||
               urlObj.hostname.length > 0;
      
      case 'study':
        return urlObj.pathname.endsWith('.pdf') || 
               urlObj.hostname.length > 0;
      
      default:
        return true;
    }
  } catch {
    return false;
  }
};

// Función para obtener sugerencias de URL válidas
export const getUrlSuggestions = (type: ResourceItem['type']): string[] => {
  switch (type) {
    case 'podcast':
      return [
        'https://open.spotify.com/episode/[ID]',
        'https://podcasts.google.com/feed/[FEED-ID]',
        'https://podcasts.apple.com/podcast/[ID]',
        'https://anchor.fm/[USERNAME]/episodes/[EPISODE]',
        'https://soundcloud.com/[USERNAME]/[TRACK]',
        'URL directa a archivo .mp3 o .m4a'
      ];
    case 'youtube':
      return [
        'https://www.youtube.com/watch?v=[VIDEO-ID]',
        'https://youtu.be/[VIDEO-ID]'
      ];
    case 'video_series':
      return [
        'https://www.youtube.com/playlist?list=[PLAYLIST-ID]',
        'https://vimeo.com/showcase/[ID]'
      ];
    default:
      return ['URL válida que comience con https://'];
  }
};

// Extraer información del thumbnail para YouTube
export const extractYouTubeThumbnail = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    let videoId: string | null = null;
    
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1);
    }
    
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
};

// Recursos por defecto del sistema
export const defaultResources: Omit<ResourceItem, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Guía de Oración Profética",
    description: "Manual completo para desarrollar tu vida de oración y escuchar la voz de Dios con claridad.",
    type: "pdf",
    url: "/resources/guia-oracion-profetica.pdf",
    featured: true,
    order_index: 1,
    active: true,
    metadata: {
      author: "Maité",
      file_size: "2.5 MB"
    }
  },
  {
    title: "Serie: Descubriendo tu Propósito",
    description: "5 videos de enseñanza sobre cómo identificar y activar el llamado divino en tu vida.",
    type: "video_series",
    url: "https://youtube.com/playlist?list=example",
    featured: false,
    order_index: 2,
    active: true,
    metadata: {
      duration: "2 horas",
      series_name: "Descubriendo tu Propósito"
    }
  },
  {
    title: "Estudio Bíblico: Identidad en Cristo",
    description: "Estudio profundo de 8 semanas sobre quiénes somos en Cristo y nuestra identidad espiritual.",
    type: "study",
    url: "/resources/estudio-identidad-cristo.pdf",
    featured: false,
    order_index: 3,
    active: true,
    metadata: {
      author: "Maité",
      duration: "8 semanas"
    }
  },
  {
    title: "Meditaciones Guiadas",
    description: "Audio meditaciones para la conexión espiritual y el crecimiento en intimidad con Dios.",
    type: "audio",
    url: "/resources/meditaciones-guiadas.mp3",
    featured: false,
    order_index: 4,
    active: true,
    metadata: {
      duration: "45 minutos",
      author: "Maité"
    }
  }
];
