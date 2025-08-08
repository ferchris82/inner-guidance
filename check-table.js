import { supabase } from '../lib/supabase.js';

// Función para verificar estructura de tabla
async function checkTableStructure() {
  console.log('🔍 Verificando estructura de la tabla blog_posts...');
  
  try {
    // Intentar obtener un registro para ver los campos
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('📋 Campos disponibles en la tabla:');
      console.log(Object.keys(data[0]));
      
      console.log('\n📝 Ejemplo de registro:');
      console.log(data[0]);
    } else {
      console.log('📋 Tabla existe pero está vacía. Intentando insertar un registro de prueba...');
      
      // Intentar insertar para ver qué campos acepta
      const { data: insertData, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title: 'Test - verificar campos',
          excerpt: 'Test excerpt',
          content: 'Test content',
          category: 'test',
          author: 'Test',
          featured_image: 'https://test.com/image.jpg',
          read_time: '1 min',
          featured: false
        })
        .select()
        .single();
        
      if (insertError) {
        console.error('❌ Error al insertar (esto nos dice qué campos faltan):', insertError);
        
        // Si falla, mostrar el mensaje del error para saber qué campos faltan
        if (insertError.message.includes('featured_image')) {
          console.log('⚠️ El campo featured_image NO EXISTE en la tabla');
        }
      } else {
        console.log('✅ Inserción exitosa. Los campos están correctos:');
        console.log(insertData);
        
        // Eliminar el registro de prueba
        await supabase
          .from('blog_posts')
          .delete()
          .eq('id', insertData.id);
        console.log('🗑️ Registro de prueba eliminado');
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkTableStructure();
