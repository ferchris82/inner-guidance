import { supabase } from '@/lib/supabase';

// Tipo para el suscriptor del newsletter
export interface NewsletterSubscriber {
  id?: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribed_at?: string;
  unsubscribed_at?: string;
  source: string;
}

// Función para suscribir un email al newsletter
export const subscribeToNewsletter = async (email: string, source = 'website'): Promise<NewsletterSubscriber | null> => {
  try {
    console.log('🔔 Intentando suscribir email:', email, 'desde:', source);
    
    // Primero verificar si el email ya existe
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('❌ Error verificando email existente:', checkError);
      throw checkError;
    }

    if (existing) {
      // Si existe pero está desuscrito, reactivar
      if (existing.status === 'unsubscribed') {
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'active',
            source: source
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error('❌ Error reactivando suscripción:', error);
          throw error;
        }

        console.log('🔄 Suscripción reactivada:', data);
        return data;
      } else {
        // Ya está activo
        console.log('ℹ️ El email ya está suscrito y activo');
        return existing;
      }
    }

    // Insertar nueva suscripción
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          status: 'active',
          source
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Error suscribiendo al newsletter:', error);
      throw error;
    }

    console.log('✅ Email suscrito exitosamente:', data);
    return data;
  } catch (error) {
    console.error('💥 Error en subscribeToNewsletter:', error);
    return null;
  }
};

// Función para obtener todos los suscriptores (para el admin)
export const getAllSubscribers = async (): Promise<NewsletterSubscriber[]> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo suscriptores:', error);
      throw error;
    }

    console.log('📊 Suscriptores obtenidos:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('💥 Error en getAllSubscribers:', error);
    return [];
  }
};

// Función para obtener estadísticas de suscriptores
export const getSubscriberStats = async () => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('status');

    if (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }

    const stats = {
      total: data?.length || 0,
      active: data?.filter(s => s.status === 'active').length || 0,
      unsubscribed: data?.filter(s => s.status === 'unsubscribed').length || 0
    };

    console.log('📈 Estadísticas de suscriptores:', stats);
    return stats;
  } catch (error) {
    console.error('💥 Error en getSubscriberStats:', error);
    return { total: 0, active: 0, unsubscribed: 0 };
  }
};

// Función para desuscribir un email
export const unsubscribeFromNewsletter = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed' })
      .eq('id', id);

    if (error) {
      console.error('❌ Error desuscribiendo:', error);
      throw error;
    }

    console.log('✅ Email desuscrito exitosamente');
    return true;
  } catch (error) {
    console.error('💥 Error en unsubscribeFromNewsletter:', error);
    return false;
  }
};

// Función para eliminar un suscriptor (para el admin)
export const deleteSubscriber = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error eliminando suscriptor:', error);
      throw error;
    }

    console.log('✅ Suscriptor eliminado exitosamente');
    return true;
  } catch (error) {
    console.error('💥 Error en deleteSubscriber:', error);
    return false;
  }
};
