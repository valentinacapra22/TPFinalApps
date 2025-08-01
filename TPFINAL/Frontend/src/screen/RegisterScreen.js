import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [existingEmails, setExistingEmails] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/usuarios");
        const emails = response.data.map(user => user.email);
        setExistingEmails(emails);
      } catch (error) {
        console.error("Error al obtener correos", error);
      }
    };
    
    fetchEmails();
  }, []);

  const handleRegister = () => {
    if (!email) {
      setErrorMessage("Por favor, ingrese un email válido.");
      return;
    }

    // Validar que el email contenga un "@"
    if (!email.includes("@")) {
      setErrorMessage("El correo electrónico debe contener un '@'.");
      return;
    }

    if (existingEmails.includes(email)) {
      setErrorMessage("El correo electrónico ya está registrado.");
      return;
    }

    navigation.navigate("RegisterDetails", { email });
    setErrorMessage("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingrese su email para registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="email@dominio.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      <Text style={styles.disclaimer}>
        Tocando, está aceptando los Términos del Servicio y las Políticas de Privacidad.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 20 },
  button: { backgroundColor: "#000", paddingVertical: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 16 },
  disclaimer: { fontSize: 12, color: "#777", textAlign: "center", marginTop: 20 },
  errorMessage: { color: "red", fontSize: 14, marginTop: 10, textAlign: "center" },
});