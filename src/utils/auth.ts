// Configuración de autenticación
const ADMIN_CREDENTIALS = {
  username: 'maite', // Cambia esto por tu usuario deseado
  password: '123', // Cambia esto por tu contraseña segura
};

const AUTH_STORAGE_KEY = 'inner_guidance_auth';
const AUTH_EXPIRY_HOURS = 24; // Sesión válida por 24 horas

export interface AuthState {
  isAuthenticated: boolean;
  timestamp: number;
  username?: string;
}

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
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
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
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Limpiar también otros datos de sesión si es necesario
    sessionStorage.removeItem('adminView');
    sessionStorage.removeItem('editingPost');
    sessionStorage.removeItem('forceReset');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

// Función para verificar si está autenticado
export const isAuthenticated = (): boolean => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return false;
    
    const authState: AuthState = JSON.parse(stored);
    const now = Date.now();
    const expiryTime = authState.timestamp + (AUTH_EXPIRY_HOURS * 60 * 60 * 1000);
    
    // Verificar si la sesión no ha expirado
    if (now > expiryTime) {
      logout(); // Limpiar sesión expirada
      return false;
    }
    
    return authState.isAuthenticated;
  } catch (error) {
    console.error('Error checking auth state:', error);
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
