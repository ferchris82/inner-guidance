// Script para inicializar recursos de ejemplo
// Este script se puede ejecutar desde el admin para crear datos de ejemplo

import { createResource } from './resourcesSupabase';
import { ResourceItem } from './resourcesConfig';

// Recursos de ejemplo para inicializar
const sampleResources = [
  {
    title: "Podcast: Caminando en Propósito Divino",
    description: "En este episodio exploramos cómo descubrir y caminar en nuestro propósito divino, superando los obstáculos que nos impiden vivir la vida plena que Dios diseñó para nosotros.",
    type: "podcast" as const,
    url: "https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk",
    featured: true,
    order_index: 1,
    active: true,
    metadata: {
      duration: "45 minutos",
      episode_number: 15,
      author: "Maité"
    }
  },
  {
    title: "Video: Descubriendo tu Identidad en Cristo",
    description: "Video enseñanza profunda sobre cómo encontrar nuestra verdadera identidad en Cristo, liberándonos de las etiquetas del mundo y abrazando quiénes somos en Él.",
    type: "youtube" as const,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    featured: false,
    order_index: 2,
    active: true,
    metadata: {
      duration: "32 minutos",
      author: "Maité"
    }
  },
  {
    title: "Guía de Oración Profética",
    description: "Manual completo para desarrollar tu vida de oración y escuchar la voz de Dios con claridad. Incluye ejercicios prácticos y testimonios reales.",
    type: "pdf" as const,
    url: "/resources/guia-oracion-profetica.pdf",
    featured: false,
    order_index: 3,
    active: true,
    metadata: {
      author: "Maité",
      file_size: "2.5 MB",
      pages: 48
    }
  },
  {
    title: "Podcast: El Poder de la Adoración Íntima",
    description: "Descubre cómo la adoración íntima transforma nuestro corazón y nos conecta profundamente con la presencia de Dios en nuestra vida diaria.",
    type: "podcast" as const,
    url: "https://open.spotify.com/episode/1A2B3C4D5E6F7G8H9I0J1K2L",
    featured: false,
    order_index: 4,
    active: true,
    metadata: {
      duration: "38 minutos",
      episode_number: 12,
      author: "Maité"
    }
  },
  {
    title: "Serie: Desarrollando Dones Espirituales",
    description: "Serie completa de 6 videos sobre cómo identificar, desarrollar y usar los dones espirituales que Dios ha puesto en tu vida para bendición de otros.",
    type: "video_series" as const,
    url: "https://youtube.com/playlist?list=PLExample123456789",
    featured: false,
    order_index: 5,
    active: true,
    metadata: {
      duration: "3.5 horas total",
      series_name: "Desarrollando Dones Espirituales",
      episodes: 6,
      author: "Maité"
    }
  },
  {
    title: "Meditación Guiada: Intimidad con el Padre",
    description: "Audio meditación guiada para profundizar tu relación íntima con Dios Padre, experimentando Su amor incondicional y presencia sanadora.",
    type: "audio" as const,
    url: "/resources/meditacion-intimidad-padre.mp3",
    featured: false,
    order_index: 6,
    active: true,
    metadata: {
      duration: "25 minutos",
      author: "Maité",
      genre: "Meditación cristiana"
    }
  }
];

// Función para inicializar recursos de ejemplo
export const initializeSampleResources = async () => {
  console.log('🔄 Iniciando creación de recursos de ejemplo...');
  
  const results = {
    created: [] as ResourceItem[],
    errors: [] as { resource: string; error: unknown }[]
  };

  for (const resource of sampleResources) {
    try {
      console.log(`📝 Creando: ${resource.title}`);
      const createdResource = await createResource(resource);
      results.created.push(createdResource);
      console.log(`✅ Creado: ${resource.title}`);
    } catch (error) {
      console.error(`❌ Error creando ${resource.title}:`, error);
      results.errors.push({ resource: resource.title, error });
    }
  }

  console.log(`🎉 Proceso completado:`);
  console.log(`   ✅ Creados: ${results.created.length}`);
  console.log(`   ❌ Errores: ${results.errors.length}`);

  return results;
};

// Función para verificar si ya existen recursos
export const checkExistingResources = async () => {
  try {
    const { getResources } = await import('./resourcesSupabase');
    const existing = await getResources();
    return existing.length > 0;
  } catch (error) {
    console.error('Error verificando recursos existentes:', error);
    return false;
  }
};

// Ejecutar automáticamente si se importa directamente
if (typeof window !== 'undefined') {
  // Solo para uso en desarrollo - no ejecutar automáticamente
  console.log('💡 Para inicializar recursos de ejemplo, usa:');
  console.log('   import { initializeSampleResources } from "@/utils/initializeResources"');
  console.log('   initializeSampleResources()');
}
