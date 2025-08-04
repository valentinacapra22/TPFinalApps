import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

const BASE_URL = "http://localhost:3000/api";

export default function RegisterDetailsScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const { email } = route.params;
  
  // Estados
  const [vecindarios, setVecindarios] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    contrasena: "",
    confirmarContrasena: "",
    direccion: "",
    telefono: "",
    vecindarioId: "",
    calle1: "",
    calle2: "",
    depto: "",
    piso: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState("");
  
  // Referencias para navegación
  const refs = {
    apellido: useRef(null),
    contrasena: useRef(null),
    confirmarContrasena: useRef(null),
    direccion: useRef(null),
    calle1: useRef(null),
    calle2: useRef(null),
    telefono: useRef(null),
  };

  // Configuración ultra responsiva (ancho Y alto)
  const isPortrait = height > width;
  const isTablet = width > 768 || height > 1000;
  const isSmallPhone = width < 375;
  const isLandscape = width > height;
  const isShortScreen = height < 700; // Pantallas cortas
  const isTallScreen = height > 850; // Pantallas altas
  const isVeryShortScreen = height < 600; // Muy cortas (landscape pequeños)
  
  // Cálculos dinámicos para diferentes orientaciones Y alturas
  const getResponsiveConfig = () => {
    let config = {
      containerPadding: 20,
      formMaxWidth: 400,
      fontSize: 16,
      titleSize: 24,
      inputHeight: 52,
      spacing: 16,
      columns: 1,
      buttonHeight: 52,
      modalHeight: 0.5,
      topPadding: height * 0.05,
      bottomPadding: height * 0.05,
      titleMargin: 24,
      formPadding: 20,
    };

    // Ajustes por ALTURA primero
    if (isVeryShortScreen) {
      config = {
        ...config,
        containerPadding: 12,
        fontSize: 14,
        titleSize: 18,
        inputHeight: 44,
        spacing: 8,
        buttonHeight: 44,
        topPadding: 10,
        bottomPadding: 10,
        titleMargin: 12,
        formPadding: 16,
        modalHeight: 0.8,
      };
    } else if (isShortScreen) {
      config = {
        ...config,
        containerPadding: 16,
        fontSize: 15,
        titleSize: 20,
        inputHeight: 48,
        spacing: 12,
        buttonHeight: 48,
        topPadding: height * 0.02,
        bottomPadding: height * 0.02,
        titleMargin: 16,
        formPadding: 18,
        modalHeight: 0.7,
      };
    } else if (isTallScreen) {
      config = {
        ...config,
        containerPadding: 24,
        fontSize: 17,
        titleSize: 28,
        inputHeight: 56,
        spacing: 20,
        buttonHeight: 56,
        topPadding: height * 0.08,
        bottomPadding: height * 0.08,
        titleMargin: 32,
        formPadding: 24,
        modalHeight: 0.4,
      };
    }

    // Luego ajustes por ANCHO (sobreescriben algunos valores si es necesario)
    if (isTablet) {
      config = {
        ...config,
        containerPadding: Math.max(config.containerPadding, 32),
        formMaxWidth: isLandscape ? 600 : 500,
        fontSize: Math.max(config.fontSize, 17),
        titleSize: Math.max(config.titleSize, 26),
        inputHeight: Math.max(config.inputHeight, 54),
        spacing: Math.max(config.spacing, 18),
        columns: isLandscape ? 2 : 1,
        buttonHeight: Math.max(config.buttonHeight, 54),
        formPadding: Math.max(config.formPadding, 28),
      };
    } else if (isSmallPhone) {
      config = {
        ...config,
        containerPadding: Math.min(config.containerPadding, 14),
        formMaxWidth: width - 28,
        fontSize: Math.min(config.fontSize, 14),
        titleSize: Math.min(config.titleSize, 19),
        inputHeight: Math.min(config.inputHeight, 46),
        spacing: Math.min(config.spacing, 10),
        buttonHeight: Math.min(config.buttonHeight, 46),
        formPadding: Math.min(config.formPadding, 16),
      };
    } else if (isLandscape && !isTablet) {
      config = {
        ...config,
        formMaxWidth: Math.min(width * 0.85, 520),
        columns: isVeryShortScreen ? 1 : 2,
        topPadding: Math.min(config.topPadding, 15),
        bottomPadding: Math.min(config.bottomPadding, 15),
      };
    }

    return config;
  };

  const config = getResponsiveConfig();

  // Cargar vecindarios
  useEffect(() => {
    const barrios = [
      { id: "1", nombre: "Quilmes Oeste" },
      { id: "2", nombre: "Quilmes Centro" },
      { id: "3", nombre: "Quilmes Este" },
      { id: "4", nombre: "La Colonia" },
      { id: "5", nombre: "Solano" },
      { id: "6", nombre: "San Francisco Solano" },
      { id: "7", nombre: "San Juan" },
      { id: "8", nombre: "Ezpeleta" },
      { id: "9", nombre: "Ezpeleta Oeste" },
    ];
    setVecindarios(barrios);
  }, []);

  // Funciones auxiliares
  const handleLoad = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.contrasena)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
      return false;
    }

    const requiredFields = ['nombre', 'apellido', 'contrasena', 'confirmarContrasena', 'direccion', 'telefono', 'vecindarioId', 'calle1', 'calle2'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setError("");
      const usuario = {
        ...formData,
        email,
        vecindarioId: parseInt(formData.vecindarioId, 10),
      };

      await axios.post(`${BASE_URL}/usuarios`, usuario, {
        headers: { "Content-Type": "application/json" },
      });

      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error en el registro:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "No se pudo registrar el usuario.");
    }
  };

  // Estilos dinámicos completamente responsivos
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f8fafc",
    },
    keyboardView: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: (isLandscape && !isTablet) || isVeryShortScreen ? 'flex-start' : 'flex-start',
      paddingHorizontal: config.containerPadding,
      paddingTop: config.topPadding,
      paddingBottom: Math.max(config.bottomPadding, 50), // Mínimo 50px abajo
      minHeight: height + 100, // Asegurar scroll siempre disponible
    },
    contentWrapper: {
      alignItems: "center",
      width: "100%",
    },
    title: {
      fontSize: config.titleSize,
      fontWeight: "800",
      color: "#1e293b",
      marginBottom: config.titleMargin,
      textAlign: "center",
      letterSpacing: -0.5,
    },
    formContainer: {
      width: "100%",
      maxWidth: config.formMaxWidth,
      backgroundColor: "#ffffff",
      borderRadius: isVeryShortScreen ? 16 : 20,
      padding: config.formPadding,
      shadowColor: "#1e293b",
      shadowOffset: { width: 0, height: isVeryShortScreen ? 4 : 8 },
      shadowOpacity: 0.1,
      shadowRadius: isVeryShortScreen ? 12 : 24,
      elevation: isVeryShortScreen ? 4 : 8,
    },
    formGrid: {
      width: "100%",
    },
    inputRow: {
      flexDirection: config.columns === 2 && !isVeryShortScreen ? "row" : "column",
      justifyContent: "space-between",
      marginBottom: config.spacing,
      gap: config.columns === 2 && !isVeryShortScreen ? config.spacing : 0,
    },
    inputContainer: {
      flex: config.columns === 2 && !isVeryShortScreen ? 1 : undefined,
      width: config.columns === 1 || isVeryShortScreen ? "100%" : undefined,
      marginBottom: config.columns === 1 || isVeryShortScreen ? config.spacing : 0,
    },
    input: {
      height: config.inputHeight,
      borderWidth: 2,
      borderColor: "#e2e8f0",
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: config.fontSize,
      backgroundColor: "#ffffff",
      color: "#1e293b",
    },
    inputFocused: {
      borderColor: "#3b82f6",
      shadowColor: "#3b82f6",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    passwordContainer: {
      position: "relative",
      width: "100%",
    },
    passwordInput: {
      height: config.inputHeight,
      borderWidth: 2,
      borderColor: "#e2e8f0",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingRight: 50,
      fontSize: config.fontSize,
      backgroundColor: "#ffffff",
      color: "#1e293b",
    },
    eyeIcon: {
      position: "absolute",
      right: 16,
      top: "50%",
      transform: [{ translateY: -10 }],
      padding: 4,
    },
    fullWidthContainer: {
      width: "100%",
      marginBottom: config.spacing,
    },
    pickerContainer: {
      height: config.inputHeight,
      borderWidth: 2,
      borderColor: "#e2e8f0",
      borderRadius: 12,
      paddingHorizontal: 16,
      justifyContent: "center",
      backgroundColor: "#ffffff",
      width: "100%",
    },
    pickerText: {
      fontSize: config.fontSize,
      color: formData.vecindarioId ? "#1e293b" : "#94a3b8",
    },
    errorContainer: {
      width: "100%",
      marginBottom: config.spacing,
    },
    errorText: {
      color: "#ef4444",
      fontSize: config.fontSize - 2,
      textAlign: "center",
      backgroundColor: "#fef2f2",
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#fecaca",
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
      marginTop: isVeryShortScreen ? config.spacing * 0.5 : config.spacing,
    },
    button: {
      width: "100%",
      maxWidth: isTablet ? 300 : "100%",
      height: config.buttonHeight,
      backgroundColor: "#3b82f6",
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#3b82f6",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    buttonText: {
      color: "#ffffff",
      fontSize: config.fontSize + 1,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: "#ffffff",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 20,
      paddingHorizontal: config.containerPadding,
      paddingBottom: 40,
      maxHeight: height * config.modalHeight,
    },
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: "#cbd5e1",
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: config.fontSize + 2,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 20,
      color: "#1e293b",
    },
  });

  // Componentes de renderizado
  const renderInput = (placeholder, field, nextField, keyboardType = "default", optional = false) => (
    <View style={styles.inputContainer}>
      <TextInput
        ref={refs[field]}
        style={styles.input}
        placeholder={`${placeholder}${optional ? " (opcional)" : ""}`}
        placeholderTextColor="#94a3b8"
        value={formData[field]}
        keyboardType={keyboardType}
        returnKeyType={nextField ? "next" : "done"}
        onSubmitEditing={() => nextField && refs[nextField]?.current?.focus()}
        onChangeText={(value) => handleLoad(field, value)}
      />
    </View>
  );

  const renderPasswordInput = (placeholder, field, nextField, showPass, setShowPass) => (
    <View style={styles.inputContainer}>
      <View style={styles.passwordContainer}>
        <TextInput
          ref={refs[field]}
          style={styles.passwordInput}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={!showPass}
          value={formData[field]}
          returnKeyType={nextField ? "next" : "done"}
          onSubmitEditing={() => nextField && refs[nextField]?.current?.focus()}
          onChangeText={(value) => handleLoad(field, value)}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPass(!showPass)}
          activeOpacity={0.7}
        >
          <FontAwesome 
            name={showPass ? "eye-slash" : "eye"} 
            size={20} 
            color="#64748b" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          bounces={true}
          alwaysBounceVertical={true}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          overScrollMode="always"
        >
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>Crear cuenta</Text>
            
            <View style={styles.formContainer}>
              <View style={styles.formGrid}>
                
                {/* Nombres */}
                <View style={styles.inputRow}>
                  {renderInput("Nombre", "nombre", "apellido")}
                  {renderInput("Apellido", "apellido", "contrasena")}
                </View>
                
                {/* Contraseñas */}
                <View style={styles.inputRow}>
                  {renderPasswordInput("Contraseña", "contrasena", "confirmarContrasena", showPassword, setShowPassword)}
                  {renderPasswordInput("Confirmar contraseña", "confirmarContrasena", "direccion", showConfirmPassword, setShowConfirmPassword)}
                </View>
                
                {/* Dirección - Siempre full width */}
                <View style={styles.fullWidthContainer}>
                  {renderInput("Dirección", "direccion", "calle1")}
                </View>
                
                {/* Calles */}
                <View style={styles.inputRow}>
                  {renderInput("Calle 1", "calle1", "calle2")}
                  {renderInput("Calle 2", "calle2", "telefono")}
                </View>
                
                {/* Piso y Depto - En pantallas muy cortas van en columna */}
                <View style={styles.inputRow}>
                  {renderInput("Piso", "piso", null, "numeric", true)}
                  {renderInput("Depto", "depto", null, "default", true)}
                </View>
                
                {/* Teléfono - Siempre full width */}
                <View style={styles.fullWidthContainer}>
                  {renderInput("Teléfono", "telefono", null, "phone-pad")}
                </View>

                {/* Selector de vecindario - Siempre full width */}
                <View style={styles.fullWidthContainer}>
                  <TouchableOpacity 
                    style={styles.pickerContainer} 
                    onPress={() => setShowPicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.pickerText}>
                      {formData.vecindarioId
                        ? vecindarios.find((v) => v.id === formData.vecindarioId)?.nombre
                        : "Seleccionar vecindario"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Error */}
                {error ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
                
                {/* Botón */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleRegister}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.buttonText}>Crear cuenta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal del picker */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Seleccionar vecindario</Text>
          <Picker
            selectedValue={formData.vecindarioId}
            onValueChange={(itemValue) => {
              handleLoad("vecindarioId", itemValue);
              setShowPicker(false);
            }}
          >
            <Picker.Item label="Seleccionar vecindario" value="" />
            {vecindarios.map((vecindario) => (
              <Picker.Item 
                key={vecindario.id} 
                label={vecindario.nombre} 
                value={vecindario.id} 
              />
            ))}
          </Picker>
        </View>
      </Modal>
    </View>
  );
}