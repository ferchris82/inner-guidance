// Servicio para gestionar recursos en Supabase
import { supabase } from '@/lib/supabase';
import { ResourceItem, CreateResourceData } from './resourcesConfig';

// Obtener todos los recursos
export async function getResources(): Promise<ResourceItem[]> {
  console.log('🔄 Obteniendo recursos...');
  
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('❌ Error obteniendo recursos:', error);
      throw new Error(`Error obteniendo recursos: ${error.message}`);
    }

    console.log(`✅ Recursos obtenidos exitosamente: ${data?.length || 0} elementos`);
    return data || [];
  } catch (error) {
    console.error('❌ Error en getResources:', error);
    throw error;
  }
}

// Obtener solo recursos activos (para mostrar en el frontend)
export async function getActiveResources(): Promise<ResourceItem[]> {
  console.log('🔄 Obteniendo recursos activos...');
  
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('❌ Error obteniendo recursos activos:', error);
      throw new Error(`Error obteniendo recursos activos: ${error.message}`);
    }

    console.log(`✅ Recursos activos obtenidos exitosamente: ${data?.length || 0} elementos`);
    return data || [];
  } catch (error) {
    console.error('❌ Error en getActiveResources:', error);
    throw error;
  }
}

// Crear un nuevo recurso
export async function createResource(resourceData: CreateResourceData): Promise<ResourceItem> {
  console.log('🔄 Creando nuevo recurso:', resourceData.title);
  
  try {
    const { data, error } = await supabase
      .from('resources')
      .insert([{
        ...resourceData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando recurso:', error);
      throw new Error(`Error creando recurso: ${error.message}`);
    }

    console.log('✅ Recurso creado exitosamente:', data.title);
    return data;
  } catch (error) {
    console.error('❌ Error en createResource:', error);
    throw error;
  }
}

// Actualizar un recurso existente
export async function updateResource(id: string, updates: Partial<CreateResourceData>): Promise<ResourceItem> {
  console.log('🔄 Actualizando recurso:', id);
  
  try {
    const { data, error } = await supabase
      .from('resources')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error actualizando recurso:', error);
      throw new Error(`Error actualizando recurso: ${error.message}`);
    }

    console.log('✅ Recurso actualizado exitosamente:', data.title);
    return data;
  } catch (error) {
    console.error('❌ Error en updateResource:', error);
    throw error;
  }
}

// Eliminar un recurso
export async function deleteResource(id: string): Promise<void> {
  console.log('🔄 Eliminando recurso:', id);
  
  try {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error eliminando recurso:', error);
      throw new Error(`Error eliminando recurso: ${error.message}`);
    }

    console.log('✅ Recurso eliminado exitosamente');
  } catch (error) {
    console.error('❌ Error en deleteResource:', error);
    throw error;
  }
}

// Reordenar recursos
export async function reorderResources(resourcesOrder: { id: string; order_index: number }[]): Promise<void> {
  console.log('🔄 Reordenando recursos...');
  
  try {
    const updates = resourcesOrder.map(({ id, order_index }) =>
      supabase
        .from('resources')
        .update({ 
          order_index,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
    );

    const results = await Promise.all(updates);
    
    // Verificar si alguna actualización falló
    const failedUpdates = results.filter(result => result.error);
    if (failedUpdates.length > 0) {
      console.error('❌ Errores reordenando recursos:', failedUpdates);
      throw new Error('Error reordenando algunos recursos');
    }

    console.log('✅ Recursos reordenados exitosamente');
  } catch (error) {
    console.error('❌ Error en reorderResources:', error);
    throw error;
  }
}

// Alternar estado activo de un recurso
export async function toggleResourceActive(id: string, active: boolean): Promise<ResourceItem> {
  console.log(`🔄 ${active ? 'Activando' : 'Desactivando'} recurso:`, id);
  
  try {
    const { data, error } = await supabase
      .from('resources')
      .update({ 
        active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error cambiando estado del recurso:', error);
      throw new Error(`Error cambiando estado del recurso: ${error.message}`);
    }

    console.log(`✅ Recurso ${active ? 'activado' : 'desactivado'} exitosamente:`, data.title);
    return data;
  } catch (error) {
    console.error('❌ Error en toggleResourceActive:', error);
    throw error;
  }
}

// Alternar estado destacado de un recurso
export async function toggleResourceFeatured(id: string, featured: boolean): Promise<ResourceItem> {
  console.log(`🔄 ${featured ? 'Destacando' : 'Quitando destaque de'} recurso:`, id);
  
  try {
    const { data, error } = await supabase
      .from('resources')
      .update({ 
        featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error cambiando estado destacado del recurso:', error);
      throw new Error(`Error cambiando estado destacado del recurso: ${error.message}`);
    }

    console.log(`✅ Recurso ${featured ? 'destacado' : 'sin destacar'} exitosamente:`, data.title);
    return data;
  } catch (error) {
    console.error('❌ Error en toggleResourceFeatured:', error);
    throw error;
  }
}

// Obtener estadísticas de recursos
export async function getResourcesStats() {
  console.log('🔄 Obteniendo estadísticas de recursos...');
  
  try {
    const { data: allResources, error: allError } = await supabase
      .from('resources')
      .select('type, active, featured');

    if (allError) {
      throw new Error(`Error obteniendo estadísticas: ${allError.message}`);
    }

    const stats = {
      total: allResources?.length || 0,
      active: allResources?.filter(r => r.active).length || 0,
      featured: allResources?.filter(r => r.featured).length || 0,
      byType: {} as Record<string, number>
    };

    // Contar por tipo
    allResources?.forEach(resource => {
      stats.byType[resource.type] = (stats.byType[resource.type] || 0) + 1;
    });

    console.log('✅ Estadísticas de recursos obtenidas exitosamente:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error en getResourcesStats:', error);
    throw error;
  }
}
