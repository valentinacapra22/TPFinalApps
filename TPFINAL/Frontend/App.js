import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { NotificationProvider } from "./src/context/NotificationContext"; 
import AppNavigator from "./src/navigation/AppNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';

function AppContent() {
  const { authData, isLoading } = useAuth();
  
  // Limpiar AsyncStorage temporalmente para solucionar el problema
  useEffect(() => {
    const clearStorage = async () => {
      try {
        // Solo limpiar las claves problemáticas
        await AsyncStorage.removeItem('userId');
        console.log("Clave 'userId' removida del AsyncStorage");
      } catch (error) {
        console.error("Error limpiando storage:", error);
      }
    };
    
    clearStorage();
  }, []);
  
  console.log("Estado de autenticación:", authData.isAuthenticated);
  console.log("Cargando:", isLoading);

  // Mostrar loading mientras se verifica el estado de autenticación
  if (isLoading) {
    return null; // O un componente de loading
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider> 
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}