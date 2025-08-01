import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, Dimensions,} from "react-native";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../service/AuthService";

const { width, height } = Dimensions.get("window");

export default function EditProfileScreen({ navigation, route }) {
  const { authData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(route.params?.userData || {});
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    calle1: "",
    calle2: "",
    piso: "",
    depto: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        nombre: userData.nombre || "",
        apellido: userData.apellido || "",
        email: userData.email || "",
        telefono: userData.telefono || "",
        direccion: userData.direccion || "",
        calle1: userData.calle1 || "",
        calle2: userData.calle2 || "",
        piso: userData.piso || "",
        depto: userData.depto || "",
      });
    }
  }, [userData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['nombre', 'apellido', 'email', 'telefono'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      Alert.alert(
        "Campos Requeridos",
        `Por favor completa los siguientes campos: ${missingFields.join(', ')}`
      );
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Email Inválido", "Por favor ingresa un email válido");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("userToken") || authData?.token;
      const userId = localStorage.getItem("usuarioId") || authData?.userId;

      console.log('🔍 Debug - Token:', token ? '' : '');
      console.log('🔍 Debug - User ID:', userId);

      if (!token || !userId) {
        Alert.alert("Error", "No se encontró información de autenticación");
        setLoading(false); 
        return;
      }

      const dataToUpdate = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value && value.trim() !== "") {
          acc[key] = value.trim();
        }
        return acc;
      }, {});

      console.log('Debug - Datos a actualizar:', dataToUpdate);

      const updatedUser = await updateUserProfile(userId, dataToUpdate, token);
      
      console.log('Debug - Usuario actualizado:', updatedUser);

      Alert.alert("Éxito", "Perfil actualizado correctamente");

      if (route.params?.onUpdate) {
        console.log('🔄 Debug - Actualizando datos en pantalla anterior');
        route.params.onUpdate(updatedUser);
      }
      
      setTimeout(() => {
        navigation.goBack();
      }, 100);

    } catch (error) {
      console.error(" Error updating profile:", error);
      console.error(" Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = "No se pudo actualizar el perfil. Intenta nuevamente.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (field, label, placeholder, keyboardType = "default", autoCapitalize = "words") => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D99FF" />
        <Text style={styles.loadingText}>Actualizando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Perfil</Text>
        <Text style={styles.subtitle}>Actualiza tu información personal</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          {renderInputField("nombre", "Nombre", "Ingresa tu nombre")}
          {renderInputField("apellido", "Apellido", "Ingresa tu apellido")}
          {renderInputField("email", "Email", "tu@email.com", "email-address", "none")}
          {renderInputField("telefono", "Teléfono", "Ingresa tu teléfono", "phone-pad")}
        </View>

        {/* Dirección */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dirección</Text>
          {renderInputField("direccion", "Dirección Principal", "Ingresa tu dirección principal")}
          {renderInputField("calle1", "Calle 1", "Primera calle")}
          {renderInputField("calle2", "Calle 2", "Segunda calle (opcional)")}
          
          <View style={styles.rowContainer}>
            <View style={styles.halfInput}>
              {renderInputField("piso", "Piso", "Número de piso")}
            </View>
            <View style={styles.halfInput}>
              {renderInputField("depto", "Depto", "Número de departamento")}
            </View>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#0D99FF",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
}); 