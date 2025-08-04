"use client";

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { USER_API, NEIGHBORHOOD_API } from "../config/apiConfig";
import BASE_URL from '../config/apiConfig';

axios.defaults.baseURL = BASE_URL;

export default function ProfileScreen({ navigation }) {
  const { logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [neighborhoodName, setNeighborhoodName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        logout();
        return;
      }

      // Aseguramos que el token esté en las cabeceras para la petición
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Hacemos una única y más eficiente llamada al endpoint '/me'
      const { data: user } = await axios.get(`${USER_API}/me`);
      setUserData(user);

      // Guardamos el ID del usuario para otros usos si es necesario
      if (user.usuarioId) {
        await AsyncStorage.setItem("usuarioId", user.usuarioId.toString());
      }

      if (user.vecindarioId) {
        fetchNeighborhoodName(user.vecindarioId);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to load user data. Please try again.");
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchNeighborhoodName = async (neighborhoodId) => {
    try {
      const { data } = await axios.get(`${NEIGHBORHOOD_API}/${neighborhoodId}`);
      setNeighborhoodName(data.nombre);
    } catch (error) {
      console.error("Error fetching neighborhood:", error);
    }
  };

  const handleLogout = () => {
    // Abre el modal de confirmación en lugar de cerrar sesión directamente
    setIsLogoutModalVisible(true);
  };
  
  const confirmLogout = async () => {
    try {
      await logout();
      setIsLogoutModalVisible(false);
    } catch (error) {
      console.error("Error en logout:", error);
      setIsLogoutModalVisible(false);
      logout(); // Intenta hacer logout de todas formas
    }
  };

  const formatLabel = (label) => {
    return label
      .replace(/_/g, " ")
      .replace(/calle1/i, "Calle 1")
      .replace(/calle2/i, "Calle 2")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D99FF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userData &&
        Object.entries(userData)
          .filter(([key]) => key.toLowerCase() !== "vecindarioid" && key.toLowerCase() !== "usuarioid")
          .map(([key, value], index) => (
            <View key={index} style={styles.infoContainer}>
              <Text style={styles.infoLabel}>{formatLabel(key)}</Text>
              {key.toLowerCase() === "contrasena" ? (
                <Text style={styles.infoValue}>{"•".repeat(8)}</Text>
              ) : (
                <Text style={styles.infoValue}>{value?.toString() ?? ""}</Text>
              )}
            </View>
          ))}

      {neighborhoodName && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Vecindario</Text>
          <Text style={styles.infoValue}>{neighborhoodName}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProfile", {
          userData: userData,
          onUpdate: (updatedUser) => {
            setUserData(updatedUser);
            fetchUserData();
          }
        })}
      >
        <Text style={styles.editText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Modal
        visible={isLogoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cerrar Sesión</Text>
            <Text style={styles.modalMessage}>¿Estás seguro de que quieres cerrar sesión?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout} // Llama a la nueva función de confirmación
              >
                <Text style={styles.modalButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoContainer: { width: "100%", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ecf0f1" },
  infoLabel: { fontSize: 14, color: "gray" },
  infoValue: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "teal",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 90,
    alignItems: "center",
  },
  logoutText: { color: "white", fontSize: 20, textAlign: "center" },
  editButton: {
    marginTop: 20,
    backgroundColor: "#0D99FF",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editText: { color: "white", fontSize: 20, textAlign: "center" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "teal",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});