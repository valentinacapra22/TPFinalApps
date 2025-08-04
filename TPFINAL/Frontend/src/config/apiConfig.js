import { Platform } from 'react-native';

/**
 * Almacena las URLs base de la API para los diferentes entornos de desarrollo.
 */
const API_URLS = {
  // URL para desarrollo en el navegador web
  web: 'http://localhost:3000/api',
  
  // URL para desarrollo en un dispositivo móvil (iOS/Android) en la misma red WiFi
  mobile: 'http://192.168.1.101:3000/api', 
};

/**
 * Determina y devuelve la URL activa de la API basándose en la plataforma (web/móvil).
 * @returns {string} La URL base de la API que se debe usar.
 */
const getActiveUrl = () => {
  return Platform.OS === 'web' ? API_URLS.web : API_URLS.mobile;
};

// Se exporta la URL activa para ser usada en toda la aplicación.
const BASE_URL = getActiveUrl();

// Constantes para los endpoints de la API
export const USER_API = `${BASE_URL}/usuarios`;
export const ALERTS_API = `${BASE_URL}/alarmas`;
export const VERIFY_TOKEN_API = `${BASE_URL}/auth/verify`;
export const NEIGHBORHOOD_API = `${BASE_URL}/vecindarios`;

export default BASE_URL;