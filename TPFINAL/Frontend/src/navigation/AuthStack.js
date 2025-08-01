import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screen/SplashScreen"; // Ensure this path is correct
import LoginScreen from "../screen/LoginScreen"; // Your unified login screen
import RegisterScreen from "../screen/RegisterScreen";
import RegisterDetailsScreen from "../screen/RegisterDetailsScreen";
import { THEME } from "../theme/theme";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash" // This ensures the app starts on the SplashScreen
      screenOptions={{
        headerStyle: THEME.headerStyle,
        headerTitleStyle: THEME.headerTitleStyle,
        cardStyle: { backgroundColor: THEME.colors.background },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Iniciar Sesión" }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Crear Cuenta" }}
      />
      <Stack.Screen
        name="RegisterDetails"
        component={RegisterDetailsScreen}
        options={{ title: "Detalles del Registro" }}
      />
    </Stack.Navigator>
  );
}