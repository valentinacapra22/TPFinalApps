import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { NotificationProvider } from "./src/context/NotificationContext"; 
import AuthStack from "./src/navigation/AuthStack";
import MainTabNavigator from "./src/navigation/MainTabNavigator";

function AppContent() {
  const { authData } = useAuth();
  

  return (
    <NavigationContainer>
      {authData.isAuthenticated ? <MainTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
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