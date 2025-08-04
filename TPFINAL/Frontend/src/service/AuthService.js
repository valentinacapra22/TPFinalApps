import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/apiConfig';

// authService.js
const login = async (email, password) => {
  try {
    console.log("Intentando login con:", email);
    console.log("URL del backend:", BASE_URL);
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      contrasena: password,
    }, {
      timeout: 15000, // 15 segundos de timeout
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log("Respuesta del servidor:", response.status);
    console.log("Datos de respuesta:", response.data);

    // Verificar que la respuesta sea exitosa
    if (response.status === 200 && response.data) {
      // Almacenar token y datos del usuario en AsyncStorage
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('usuarioId', response.data.user.usuarioId.toString());
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        console.log("Datos guardados en AsyncStorage");
      }

      return response.data;
    } else {
      console.log("Respuesta inválida del servidor");
      return null;
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    
    if (error.response) {
      // El servidor respondió con un código de error
      console.log("Error del servidor:", error.response.status, error.response.data);
      throw new Error(error.response.data?.message || "Error del servidor");
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.log("Error de red: No se recibió respuesta del servidor");
      console.log("Verifica que el backend esté ejecutándose en:", BASE_URL);
      throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.");
    } else {
      // Algo más causó el error
      console.log("Error:", error.message);
      throw new Error("Error de conexión: " + error.message);
    }
  }
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error("Error obteniendo token:", error);
    return null;
  }
};

const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error);
    return null;
  }
};

const logout = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('usuarioId');
    await AsyncStorage.removeItem('userId'); // Limpiar también la clave antigua por si acaso
    console.log("Logout exitoso");
  } catch (error) {
    console.error("Error en logout:", error);
  }
};

const updateUserProfile = async (userId, userData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/usuarios/${userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Actualizar los datos del usuario en AsyncStorage
    const updatedUser = response.data;
    await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

    return updatedUser;
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return null;
  }
};

const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage limpiado completamente");
  } catch (error) {
    console.error("Error limpiando AsyncStorage:", error);
  }
};

export { login, getToken, getUserData, logout, updateUserProfile, clearAllStorage };