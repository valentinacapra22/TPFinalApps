import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const BASE_URL = "http://localhost:3000/Api";

const RegistroScreen = ({ navigation, route }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // Función para registrar un nuevo usuario
  const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/usuarios`, {
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        telefono: userData.telefono,
        contrasena: userData.contrasena
      });
      return response.data;
    } catch (error) {
      console.error('Error en el registro:', error.response?.data || error.message);
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!form.nombre || !form.apellido || !form.telefono || !form.contrasena || !form.confirmarContrasena) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios.');
      return;
    }

    if (form.contrasena !== form.confirmarContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(form.contrasena)) {
      Alert.alert('Contraseña no válida', 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
      return;
    }

    setIsLoading(true);

    const userData = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      telefono: form.telefono.trim(),
      contrasena: form.contrasena,
      email: route.params?.email || ''
    };

    try {
      // 1. Registrar el nuevo usuario
      const response = await registerUser(userData);
      
      // 2. Navegar a la siguiente pantalla con el ID del usuario
      navigation.navigate('ServiceDetails', { 
        userId: response.usuarioId,
        userEmail: userData.email
      });
      
    } catch (error) {
      let errorMessage = 'No se pudo completar el registro. Por favor intente nuevamente.';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || 'Datos inválidos';
        } else if (error.response.status === 409) {
          errorMessage = 'El email ya está registrado';
        } else if (error.response.status === 422) {
          errorMessage = 'Error de validación: ' + (error.response.data.errors?.join(', ') || 'Datos inválidos');
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Detalles del Registro</Text>
      </View>

      <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>

      <Text style={styles.label}>Ingrese su nombre <Text style={styles.required}>(*)</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={form.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
        maxLength={50}
      />

      <Text style={styles.label}>Ingrese su apellido <Text style={styles.required}>(*)</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={form.apellido}
        onChangeText={(text) => handleChange('apellido', text)}
        maxLength={50}
      />

      <Text style={styles.label}>Ingrese su teléfono <Text style={styles.required}>(*)</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={form.telefono}
        onChangeText={(text) => handleChange('telefono', text)}
        maxLength={15}
      />

      <Text style={styles.label}>Ingrese una contraseña <Text style={styles.required}>(*)</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={form.contrasena}
        onChangeText={(text) => handleChange('contrasena', text)}
        maxLength={30}
      />
      <Text style={styles.passwordHint}>
        La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.
      </Text>

      <Text style={styles.label}>Confirmar contraseña <Text style={styles.required}>(*)</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={form.confirmarContrasena}
        onChangeText={(text) => handleChange('confirmarContrasena', text)}
        maxLength={30}
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Procesando...' : 'Registrarse'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40, backgroundColor: '#F9F9F9', flexGrow: 1 },
  header: { backgroundColor: '#6AA084', padding: 15, borderRadius: 5, marginBottom: 20 },
  headerText: { color: '#000', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  label: { marginBottom: 5, fontWeight: '500' },
  required: { color: 'red' },
  input: { 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 6, 
    padding: 10, 
    marginBottom: 15, 
    backgroundColor: '#fff',
    fontSize: 16
  },
  passwordHint: { fontSize: 12, color: '#666', marginBottom: 15, fontStyle: 'italic' },
  button: { 
    backgroundColor: '#043D1D', 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 30 
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  disabledButton: { backgroundColor: '#cccccc' },
});

export default RegistroScreen;