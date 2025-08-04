import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotification } from "../context/NotificationContext";
import axios from "axios";
import { connectSocket } from "../utils/socket";
import { useAuth } from "../context/AuthContext";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
// --- LÍNEA CORREGIDA ---
import BASE_URL, { USER_API } from "../config/apiConfig"; 

export default function AlertScreen() {
  const [userData, setUserData] = useState(null);
  const { authData } = useAuth();
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Manejar el caso cuando NotificationContext no esté disponible
  let showNotification;
  try {
    const notificationContext = useNotification();
    showNotification = notificationContext.showNotification;
  } catch (error) {
    console.log("NotificationContext no disponible, usando función por defecto");
    showNotification = (title, message, type = 'info') => {
      Alert.alert(title, message);
    };
  }

  // Hook para cargar datos del usuario y ubicación
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken") || authData.token;
        if (!token) {
          Alert.alert("Error", "No hay token de autenticación");
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data: user } = await axios.get(`${USER_API}/me`);
        setUserData(user);
        
        if (user.usuarioId) {
            await AsyncStorage.setItem("usuarioId", user.usuarioId.toString());
        }
        
        if (user.vecindarioId && !isConnected) {
          connectSocket(user.usuarioId, user.vecindarioId);
          setIsConnected(true);
          console.log(`🔌 Conectado al vecindario ${user.vecindarioId}`);
        }

        console.log(`✅ Usuario cargado: ${user.nombre} ${user.apellido}`);

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permiso Denegado", "Necesitamos tu ubicación para proceder.");
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(currentLocation.coords);
        console.log('📍 Ubicación obtenida:', currentLocation.coords);

      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.error("Error 404: El endpoint /me no fue encontrado o el usuario no existe en la BD.");
        } else {
            console.error("Error fetching initial data:", error);
        }
        Alert.alert("Error", "No se pudo cargar tu información. Intenta reiniciar la app.");
      }
    };

    fetchInitialData();
  }, [authData.token]);


  const handleEmergencyCall = () => {
    Linking.openURL("tel:911").catch(() => {
      Alert.alert("Error", "No se puede realizar la llamada");
    });
  };

  const handleAlertPress = async (alertType) => {
    if (!userData?.vecindarioId) {
      Alert.alert("Error", "No perteneces a ningún vecindario");
      return;
    }

    if (!location) {
      Alert.alert("Error", "No se pudo obtener tu ubicación. Por favor, asegúrate de tener los permisos activados.");
      return;
    }

    setIsLoading(true);
    try {
        const userId = await AsyncStorage.getItem("usuarioId");
        if (!userId) {
            Alert.alert("Error", "No se pudo identificar al usuario.");
            setIsLoading(false);
            return;
        }
      const emisor = `${userData.nombre} ${userData.apellido}`;

      console.log('🚨 Enviando alarma a /alarmas/activar:', {
        tipo: alertType,
        usuarioId: userId,
        vecindarioId: userData.vecindarioId,
        emisor: emisor,
        latitud: location.latitude,
        longitud: location.longitude
      });

      const alarmaResponse = await axios.post(`${BASE_URL}/alarmas/activar`, {
        tipo: alertType,
        descripcion: `Alarma de ${alertType} activada por ${emisor}`,
        usuarioId: userId,
        latitud: location.latitude,
        longitud: location.longitude,
      });

      console.log('✅ Alarma activada:', alarmaResponse.data);

      showNotification(
        `🚨 Alarma de ${alertType}`,
        `Alarma activada exitosamente en tu vecindario`,
        'success'
      );
      
      Alert.alert(
        "Alarma Enviada", 
        `La alarma de ${alertType} ha sido enviada exitosamente a tu vecindario.`,
        [{ text: "OK" }]
      );

    } catch (error) {
        // Mejor log de error para ver el mensaje del backend si existe
        const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error('❌ Error activando alarma:', errorMessage);
        Alert.alert("Error", "No se pudo activar la alarma. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚨 Alertas de Emergencia</Text>
        <Text style={styles.headerSubtitle}>
          Selecciona el tipo de emergencia para alertar a tu vecindario
        </Text>
      </View>

      <View style={styles.grid}>
        {alertTypes.map((alert, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.alertButton, 
              { backgroundColor: alert.color },
              isLoading && styles.alertButtonDisabled
            ]}
            onPress={() => handleAlertPress(alert.label)}
            disabled={isLoading}
          >
            <Ionicons name={alert.icon} size={40} color="white" />
            <Text style={styles.alertText}>{alert.label}</Text>
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <Text style={styles.loadingText}>Enviando...</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.emergencyContainer}>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
        >
          <Ionicons name="call" size={24} color="white" style={styles.emergencyIcon} />
          <Text style={styles.emergencyText}>Llamar Emergencias</Text>
        </TouchableOpacity>
      </View>

      {!location && (
        <View style={styles.locationWarning}>
          <Text style={styles.locationWarningText}>
            ⚠️ Obteniendo ubicación... Asegúrate de tener los permisos activados.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const alertTypes = [
  { id: 1, label: "Ambulancia", icon: "medical", color: "#e74c3c" },
  { id: 2, label: "Violencia", icon: "hand-left", color: "#f39c12" },
  { id: 3, label: "Homicidio", icon: "skull", color: "#c0392b" },
  { id: 4, label: "Incendio", icon: "flame", color: "#e67e22" },
  { id: 5, label: "Accidente", icon: "car-sport", color: "#3498db" },
  { id: 6, label: "Asalto", icon: "shield-checkmark", color: "#9b59b6" },
  { id: 7, label: "Inundación", icon: "water", color: "#2980b9" },
  { id: 8, label: "Sospechoso", icon: "eye", color: "#34495e" },
];

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    alignItems: "center", 
    padding: 16,
    backgroundColor: '#f8f9fa'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  alertButton: {
    width: 130,
    height: 115,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    borderRadius: 20,
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  alertButtonDisabled: {
    opacity: 0.6,
  },
  alertText: {
    color: "white",
    marginTop: 8,
    textAlign: "center",
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emergencyContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
  },
  emergencyButton: {
    backgroundColor: "red",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emergencyIcon: {
    marginRight: 8,
  },
  emergencyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  locationWarning: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  locationWarningText: {
    color: '#856404',
    textAlign: 'center',
    fontSize: 14,
  },
});