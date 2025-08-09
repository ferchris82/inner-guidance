// Script para limpiar localStorage de categorías (ejecutar en consola del navegador)
// Ejecutar en: http://localhost:8080

console.log('🧹 Iniciando limpieza de localStorage...');

const keysToRemove = [
  'blog_categories',
  'blog_categories_cache', 
  'categories',
  'categories_cache',
  'inner-guidance-categories',
  'blog-system-categories'
];

let removedCount = 0;

keysToRemove.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Eliminado: ${key}`);
    removedCount++;
  }
});

// Limpiar cualquier clave que contenga "categor"
const allKeys = Object.keys(localStorage);
allKeys.forEach(key => {
  if (key.toLowerCase().includes('categor') && !keysToRemove.includes(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Eliminado (contiene 'categor'): ${key}`);
    removedCount++;
  }
});

if (removedCount === 0) {
  console.log('✨ No se encontraron datos de categorías en localStorage');
} else {
  console.log(`✨ Limpieza completada. ${removedCount} elementos eliminados.`);
  console.log('🔄 Recarga la página para ver los cambios');
}

console.log('📡 Ahora las categorías se cargan desde Supabase');
