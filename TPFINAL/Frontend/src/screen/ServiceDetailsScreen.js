import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const BASE_URL = "http://localhost:3000/Api";

const ServiceDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const datosPersonales = route.params?.form || {};
  const datosPrevios = route.params?.datos || {};
  const userId = route.params?.userId;

  const [direccion, setDireccion] = useState('');
  const [calle1, setCalle1] = useState('');
  const [calle2, setCalle2] = useState('');
  const [piso, setPiso] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [vecindario, setVecindario] = useState('');
  const [vecindarios, setVecindarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errores, setErrores] = useState({});

  // Obtener vecindarios desde la base de datos
  useEffect(() => {
    const fetchVecindarios = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/vecindarios`);
        setVecindarios(response.data);
      } catch (error) {
        console.error('Error al obtener vecindarios:', error);
        // Si falla la conexión, usar datos locales como respaldo
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
      }
    };
    fetchVecindarios();
  }, []);

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!direccion.trim()) nuevosErrores.direccion = 'Campo obligatorio';
    if (!vecindario.trim()) nuevosErrores.vecindario = 'Campo obligatorio';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) return;
    
    setIsLoading(true);
    
    try {
      await axios.patch(`${BASE_URL}/usuarios/${userId}/domicilio`, {
        direccion,
        vecindarioId: vecindario,
        calle1,
        calle2,
        piso,
        depto: departamento
      });

      Alert.alert(
        'Registro exitoso',
        '¡Tu cuenta ha sido creada correctamente!',
        [
          {
            text: 'OK',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          }
        ]
      );
      
    } catch (error) {
      console.error('Error al guardar domicilio:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'No se pudo completar el registro. Por favor intente nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Detalles del Registro</Text>
      </View>

      <Text style={styles.sectionTitle}>DOMICILIO</Text>

      <Text style={styles.label}>
        Ingrese su dirección <Text style={styles.required}>(*)</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
      />
      {errores.direccion && <Text style={styles.error}>{errores.direccion}</Text>}

      <Text style={styles.label}>Entre calles</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Calle 1"
          value={calle1}
          onChangeText={setCalle1}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Calle 2"
          value={calle2}
          onChangeText={setCalle2}
        />
      </View>

      <Text style={styles.label}>Ingrese el número de piso</Text>
      <TextInput
        style={styles.input}
        placeholder="Piso"
        value={piso}
        onChangeText={setPiso}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Ingrese el departamento</Text>
      <TextInput
        style={styles.input}
        placeholder="Departamento"
        value={departamento}
        onChangeText={setDepartamento}
      />

      <Text style={styles.label}>
        Ingrese el vecindario <Text style={styles.required}>(*)</Text>
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={vecindario}
          onValueChange={(itemValue) => setVecindario(itemValue)}
        >
          <Picker.Item label="Seleccione un vecindario" value="" />
          {vecindarios.map((barrio) => (
            <Picker.Item 
              key={barrio.id} 
              label={barrio.nombre} 
              value={barrio.id} 
            />
          ))}
        </Picker>
      </View>
      {errores.vecindario && <Text style={styles.error}>{errores.vecindario}</Text>}

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    padding: 20,
  },
  headerBar: {
    backgroundColor: '#4f9a94',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white',
  },
  sectionTitle: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    fontWeight: '500',
  },
  required: {
    color: 'red',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginTop: 4,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  button: {
    backgroundColor: '#0a3d0a',
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default ServiceDetailsScreen;