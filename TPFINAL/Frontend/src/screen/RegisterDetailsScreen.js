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

// URL de la API
const BASE_URL = "http://localhost:3000/Api";

export default function RegisterDetailsScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const { email } = route.params;
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
  
  // Refs para navegación entre inputs
  const refApellido = useRef(null);
  const refContrasena = useRef(null);
  const refConfirmarContrasena = useRef(null);
  const refDireccion = useRef(null);
  const refCalle1 = useRef(null);
  const refCalle2 = useRef(null);
  const refTelefono = useRef(null);

  useEffect(() => {
    const fetchVecindarios = () => {
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
    };
    fetchVecindarios();
  }, []);

  const handleLoad = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      // Verificar que las contraseñas coincidan
      if (formData.contrasena !== formData.confirmarContrasena) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      // Verificar que la contraseña cumpla con los requisitos
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.contrasena)) {
        setError(
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número."
        );
        return;
      }

      // Limpiar errores previos
      setError("");

      // Verificar campos requeridos (piso y depto son opcionales)
      if (
        !formData.nombre ||
        !formData.apellido ||
        !formData.contrasena ||
        !formData.confirmarContrasena ||
        !formData.direccion ||
        !formData.telefono ||
        !formData.vecindarioId ||
        !formData.calle1 ||
        !formData.calle2
      ) {
        Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
        return;
      }

      const usuario = {
        ...formData,
        email,
        vecindarioId: parseInt(formData.vecindarioId, 10),
      };

      const response = await axios.post(`${BASE_URL}/usuarios`, usuario, {
        headers: { "Content-Type": "application/json" },
      });

      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error en el registro:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo registrar el usuario."
      );
    }
  };

  // Cálculos para estilos
  const getInputWidth = () => (width < 400 ? width * 0.9 : width * 0.85);
  const getButtonWidth = () => (width < 400 ? width * 0.7 : width * 0.5);
  const getFontSize = () => (width < 400 ? 16 : 18);

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      padding: width * 0.05,
      paddingTop: height * 0.04,
      paddingBottom: height * 0.08,
    },
    title: {
      fontSize: width < 400 ? 20 : 24,
      fontWeight: "bold",
      marginBottom: height * 0.02,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: width * 0.03,
      height: Platform.OS === "ios" ? 50 : 55,
      fontSize: getFontSize(),
      borderRadius: 5,
      marginBottom: height * 0.015,
      width: getInputWidth(),
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: getInputWidth(),
      marginBottom: height * 0.015,
    },
    eyeIcon: {
      position: "absolute",
      right: width * 0.03,
      padding: 10,
    },
    pickerContainer: {
      width: getInputWidth(),
      borderWidth: 1,
      borderColor: "#ccc",
      padding: width * 0.03,
      borderRadius: 5,
      marginBottom: height * 0.015,
      justifyContent: "center",
      minHeight: 50,
    },
    pickerText: {
      fontSize: getFontSize(),
      color: "#000",
    },
    button: {
      backgroundColor: "#000",
      paddingVertical: height * 0.02,
      borderRadius: 5,
      alignItems: "center",
      width: getButtonWidth(),
      marginTop: height * 0.02,
    },
    buttonText: {
      color: "#FFF",
      fontSize: getFontSize(),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "#FFF",
      padding: width * 0.05,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      maxHeight: height * 0.4,
    },
    errorText: {
      color: "red",
      fontSize: getFontSize() - 4,
      marginBottom: height * 0.01,
      textAlign: "center",
      width: getInputWidth(),
      paddingHorizontal: width * 0.02,
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.container} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Completa tus datos</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={formData.nombre}
          returnKeyType="next"
          onSubmitEditing={() => refApellido.current.focus()}
          onChangeText={(value) => handleLoad("nombre", value)}
        />
        <TextInput
          ref={refApellido}
          style={styles.input}
          placeholder="Apellido"
          value={formData.apellido}
          returnKeyType="next"
          onSubmitEditing={() => refContrasena.current.focus()}
          onChangeText={(value) => handleLoad("apellido", value)}
        />
        
        <View style={styles.passwordContainer}>
          <TextInput
            ref={refContrasena}
            style={[styles.input, { flex: 1 }]}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={formData.contrasena}
            returnKeyType="next"
            onSubmitEditing={() => refConfirmarContrasena.current.focus()}
            onChangeText={(value) => handleLoad("contrasena", value)}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            ref={refConfirmarContrasena}
            style={[styles.input, { flex: 1 }]}
            placeholder="Confirmar Contraseña"
            secureTextEntry={!showConfirmPassword}
            value={formData.confirmarContrasena}
            returnKeyType="next"
            onSubmitEditing={() => refDireccion.current.focus()}
            onChangeText={(value) => handleLoad("confirmarContrasena", value)}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <TextInput
          ref={refDireccion}
          style={styles.input}
          placeholder="Dirección"
          value={formData.direccion}
          returnKeyType="next"
          onSubmitEditing={() => refCalle1.current.focus()}
          onChangeText={(value) => handleLoad("direccion", value)}
        />
        
        <TextInput 
          ref={refCalle1}
          style={styles.input}
          placeholder="Calle 1"
          value={formData.calle1}
          returnKeyType="next"
          onSubmitEditing={() => refCalle2.current.focus()}
          onChangeText={(value) => handleLoad("calle1", value)}
        />
        
        <TextInput
          ref={refCalle2}
          style={styles.input}
          placeholder="Calle 2"
          value={formData.calle2}
          returnKeyType="next"
          onSubmitEditing={() => refTelefono.current.focus()}
          onChangeText={(value) => handleLoad("calle2", value)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Piso (opcional)"
          value={formData.piso}
          keyboardType="numeric"
          onChangeText={(value) => handleLoad("piso", value)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Depto (opcional)"
          value={formData.depto}
          onChangeText={(value) => handleLoad("depto", value)}
        />
        
        <TextInput
          ref={refTelefono}
          style={styles.input}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          value={formData.telefono}
          onChangeText={(value) => handleLoad("telefono", value)}
        />

        <TouchableOpacity 
          style={styles.pickerContainer} 
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.pickerText}>
            {formData.vecindarioId
              ? vecindarios.find((v) => v.id === formData.vecindarioId)?.nombre
              : "Seleccione un vecindario"}
          </Text>
        </TouchableOpacity>

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
            <Picker
              selectedValue={formData.vecindarioId}
              onValueChange={(itemValue) => {
                handleLoad("vecindarioId", itemValue);
                setShowPicker(false);
              }}
            >
              <Picker.Item label="Seleccione un vecindario" value="" />
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

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}