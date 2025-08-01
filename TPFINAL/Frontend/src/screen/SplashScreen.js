import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

export default function SplashScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../../assets/Fondo.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>VigiNet</Text>
        <Text style={styles.subtitle}>Comunidad segura</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>INGRESAR</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: { width: 200, height: 210, marginBottom: 20 },
  title: { fontSize: 58, fontWeight: 'bold', color: '#000000', textAlign: 'center' },
  subtitle: { fontSize: 30, color: '#000000', marginBottom: 100, fontWeight: 'bold', textAlign: 'center' },
  button: { backgroundColor: '#093916', paddingHorizontal: 50, paddingVertical: 20, borderRadius: 100 },
  buttonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
});
