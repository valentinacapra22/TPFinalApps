import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const RegistroScreen = ({ navigation, route }) => {
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

    // Si todo es válido, navega a ServiceDetailsScreen con los datos
    navigation.navigate('ServiceDetails', { form });
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
      />

      <Text style={styles.label}>Ingrese su apellido <Text style={styles.required}>(*)</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={form.apellido}
        onChangeText={(text) => handleChange('apellido', text)}
      />

      <Text style={styles.label}>Ingrese su teléfono <Text style={styles.required}>(*)</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={form.telefono}
        onChangeText={(text) => handleChange('telefono', text)}
      />

      <Text style={styles.label}>Ingrese una contraseña <Text style={styles.required}>(*)</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={form.contrasena}
        onChangeText={(text) => handleChange('contrasena', text)}
      />
      <Text style={styles.passwordHint}>
        La contraseña debe tener al menos una mayúscula, un número y un carácter especial.
      </Text>

      <Text style={styles.label}>Confirmar contraseña <Text style={styles.required}>(*)</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={form.confirmarContrasena}
        onChangeText={(text) => handleChange('confirmarContrasena', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Siguiente</Text>
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
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 15, backgroundColor: '#fff' },
  passwordHint: { fontSize: 12, color: '#666', marginBottom: 15 },
  button: { backgroundColor: '#043D1D', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default RegistroScreen;
