// Configuración de autenticación
const ADMIN_CREDENTIALS = {
  username: 'maite', // Cambia esto por tu usuario deseado
  password: '123', // Cambia esto por tu contraseña segura
};

const AUTH_STORAGE_KEY = 'inner_guidance_auth';
const AUTH_EXPIRY_HOURS = 2; // Sesión válida por 2 horas (más seguro)

export interface AuthState {
  isAuthenticated: boolean;
  timestamp: number;
  username?: string;
}

// Función para inicializar el logout automático
export const initializeAutoLogout = (): (() => void) => {
  // TEMPORALMENTE DESACTIVADO PARA DEBUG
  console.log('🔐 Auto-logout desactivado temporalmente para debug');
  return () => {}; // No-op cleanup function
  
  /*
  // Logout automático al cerrar la ventana/pestaña
  const handleBeforeUnload = () => {
    logout();
  };
  
  // Logout automático al cambiar de pestaña por mucho tiempo
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Guardar timestamp cuando se oculta la página
      sessionStorage.setItem('pageHiddenAt', Date.now().toString());
    } else {
      // Verificar cuánto tiempo estuvo oculta la página
      const hiddenAt = sessionStorage.getItem('pageHiddenAt');
      if (hiddenAt) {
        const hiddenTime = Date.now() - parseInt(hiddenAt);
        // Si estuvo oculta más de 10 minutos, hacer logout
        if (hiddenTime > 10 * 60 * 1000) {
          logout();
          window.location.href = '/';
        }
        sessionStorage.removeItem('pageHiddenAt');
      }
    }
  };
  
  // Agregar event listeners
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('pagehide', handleBeforeUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Cleanup function (para componentes de React)
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('pagehide', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
  */
};

// Función para validar credenciales
export const validateCredentials = (username: string, password: string): boolean => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
};

// Función para iniciar sesión
export const login = (username: string, password: string): boolean => {
  if (validateCredentials(username, password)) {
    const authState: AuthState = {
      isAuthenticated: true,
      timestamp: Date.now(),
      username: username
    };
    
    try {
      // Usar localStorage para mantener sesión al recargar (con expiración)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
      console.log('🔐 Login exitoso, datos guardados:', authState);
      console.log('🔐 Verificando que se guardó:', localStorage.getItem(AUTH_STORAGE_KEY));
      
      // Inicializar el logout automático
      initializeAutoLogout();
      
      return true;
    } catch (error) {
      console.error('Error saving auth state:', error);
      return false;
    }
  }
  return false;
};

// Función para cerrar sesión
export const logout = (): void => {
  try {
    console.log('🔐 Ejecutando logout - limpiando datos');
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    // Limpiar también otros datos de sesión si es necesario
    sessionStorage.removeItem('adminView');
    sessionStorage.removeItem('editingPost');
    sessionStorage.removeItem('forceReset');
    sessionStorage.removeItem('pageHiddenAt');
    
    // También limpiar localStorage de datos del blog por seguridad
    localStorage.removeItem('blogPosts');
    localStorage.removeItem('socialLinks');
    
    console.log('✅ Sesión cerrada correctamente');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

// Función para verificar si está autenticado
export const isAuthenticated = (): boolean => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    console.log('🔐 Datos almacenados:', stored);
    if (!stored) {
      console.log('🔐 No hay datos de autenticación almacenados');
      return false;
    }
    
    const authState: AuthState = JSON.parse(stored);
    console.log('🔐 Estado parseado:', authState);
    const now = Date.now();
    const expiryTime = authState.timestamp + (AUTH_EXPIRY_HOURS * 60 * 60 * 1000);
    console.log('🔐 Tiempo actual:', new Date(now));
    console.log('🔐 Tiempo expiración:', new Date(expiryTime));
    console.log('🔐 ¿Expirado?:', now > expiryTime);
    
    // Verificar si la sesión no ha expirado
    if (now > expiryTime) {
      console.log('🔐 Sesión expirada, haciendo logout');
      logout(); // Limpiar sesión expirada
      return false;
    }
    
    console.log('🔐 Autenticación válida:', authState.isAuthenticated);
    return authState.isAuthenticated;
  } catch (error) {
    console.error('🔐 Error checking auth state:', error);
    logout(); // Limpiar datos corruptos
    return false;
  }
};

// Función para obtener información del usuario autenticado
export const getAuthenticatedUser = (): string | null => {
  try {
    if (!isAuthenticated()) return null;
    
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    
    const authState: AuthState = JSON.parse(stored);
    return authState.username || null;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
};

// Función para renovar la sesión
export const renewSession = (): void => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return;
    
    const authState: AuthState = JSON.parse(stored);
    if (authState.isAuthenticated) {
      authState.timestamp = Date.now();
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    }
  } catch (error) {
    console.error('Error renewing session:', error);
  }
};
