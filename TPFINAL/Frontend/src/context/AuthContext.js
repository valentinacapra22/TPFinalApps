import React, { createContext, useState, useContext } from "react";
import { login } from "../service/AuthService"; // Asegúrate de importar la función de autenticación

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    isAuthenticated: false, // Cambiado de vuelta a false para que inicie en SplashScreen
    token: null, // Agregar el token JWT
  });

  // Función para realizar el login
  const loginUser = async (email, password) => {
    try {
      const data = await login(email, password); // Llama a la función de autenticación
      if (data) {
        // Si la autenticación es exitosa, guarda el token y el email
        console.log("llego a cargar el AuthData");
        setAuthData({
          email,
          password: "",
          isAuthenticated: true,
          token: data.token,
        });
        return true;
      } else {
        // Si la autenticación falla, muestra un mensaje de error
        alert("Error al iniciar sesión: " + data.message);
      }
    } catch (error) {
      alert("Error de conexión. Intenta nuevamente.");
    }
  };

  const logout = () => {
    setAuthData({
      email: "",
      password: "",
      isAuthenticated: false,
      token: null,
    }); // Limpiar datos de autenticación
  };

  return (
    <AuthContext.Provider value={{ authData, loginUser, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
