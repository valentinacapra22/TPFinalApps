import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterDetailsScreen = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (
      !form.nombre ||
      !form.apellido ||
      !form.telefono ||
      !form.contrasena ||
      !form.confirmarContrasena
    ) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (form.contrasena !== form.confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Navegar a ServiceDetails con los datos del formulario
    navigation.navigate('ServiceDetails', { datos: form });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Datos personales</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={form.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={form.apellido}
        onChangeText={(text) => handleChange('apellido', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={form.telefono}
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange('telefono', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={form.contrasena}
        secureTextEntry
        onChangeText={(text) => handleChange('contrasena', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={form.confirmarContrasena}
        secureTextEntry
        onChangeText={(text) => handleChange('confirmarContrasena', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
