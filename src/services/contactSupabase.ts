import { supabase } from '@/lib/supabase';

// Tipo para el formulario de contacto
export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  service: string;
  message: string;
  status: 'nuevo' | 'leido' | 'respondido';
  created_at?: string;
  updated_at?: string;
}

// Función para guardar un mensaje de contacto
export const saveContactMessage = async (messageData: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<ContactMessage | null> => {
  try {
    console.log('🚀 Intentando guardar mensaje:', messageData);
    console.log('📊 Supabase configurado con URL:', import.meta.env.VITE_SUPABASE_URL ? 'SÍ' : 'NO');
    console.log('🔑 Supabase configurado con KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SÍ' : 'NO');
    
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          ...messageData,
          status: 'nuevo'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Error al guardar mensaje de contacto:', error);
      console.error('📋 Detalles del error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('✅ Mensaje de contacto guardado exitosamente:', data);
    return data;
  } catch (error) {
    console.error('💥 Error en saveContactMessage:', error);
    return null;
  }
};

// Función para obtener todos los mensajes de contacto (para el admin)
export const getAllContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener mensajes de contacto:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error en getAllContactMessages:', error);
    return [];
  }
};

// Función para marcar un mensaje como leído
export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ 
        status: 'leido',
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) {
      console.error('Error al marcar mensaje como leído:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error en markMessageAsRead:', error);
    return false;
  }
};

// Función para marcar un mensaje como respondido
export const markMessageAsResponded = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ 
        status: 'respondido',
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) {
      console.error('Error al marcar mensaje como respondido:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error en markMessageAsResponded:', error);
    return false;
  }
};

// Función para eliminar un mensaje
export const deleteContactMessage = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error al eliminar mensaje de contacto:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error en deleteContactMessage:', error);
    return false;
  }
};
