import React, { createContext, useState, useContext, useEffect } from "react";
import { login, logout as logoutService, getToken, getUserData } from "../service/AuthService";

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    isAuthenticated: false,
    token: null,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un token guardado al iniciar la app
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await getToken();
        const user = await getUserData();
        
        if (token && user) {
          console.log("Token encontrado, restaurando sesión...");
          setAuthData({
            email: user.email || "",
            password: "",
            isAuthenticated: true,
            token: token,
            user: user,
            userId: user.usuarioId ? user.usuarioId.toString() : null,
          });
        }
      } catch (error) {
        console.error("Error verificando estado de autenticación:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Función para realizar el login
  const loginUser = async (email, password) => {
    try {
      console.log("Iniciando login para:", email);
      const data = await login(email, password);
      
      if (data && data.token) {
        // Si la autenticación es exitosa, guarda el token y el email
        console.log("Login exitoso, configurando authData");
        setAuthData({
          email,
          password: "",
          isAuthenticated: true,
          token: data.token,
          user: data.user,
          userId: data.user.usuarioId ? data.user.usuarioId.toString() : null,
        });
        return true;
      } else {
        // Si la autenticación falla, retorna false
        console.log("Login fallido: respuesta inválida");
        return false;
      }
    } catch (error) {
      console.error("Error en loginUser:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setAuthData({
        email: "",
        password: "",
        isAuthenticated: false,
        token: null,
        user: null,
        userId: null,
      });
    } catch (error) {
      console.error("Error en logout:", error);
      // Aún así limpiar los datos locales
      setAuthData({
        email: "",
        password: "",
        isAuthenticated: false,
        token: null,
        user: null,
        userId: null,
      });
    }
  };

  // No renderizar nada mientras se verifica el estado de autenticación
  if (isLoading) {
    return null; // O un componente de loading
  }

  return (
    <AuthContext.Provider value={{ authData, loginUser, logout, setAuthData, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
