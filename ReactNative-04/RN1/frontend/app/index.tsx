import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function PantallaInicio() {
  const router = useRouter();
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Registro de usuario</Text>
      <TouchableOpacity style={styles.boton} onPress={() => router.push('/login')}>
        <Text style={styles.textoBoton}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.boton, styles.botonSecundario]} onPress={() => router.push('/registro')}>
        <Text style={[styles.textoBoton, styles.textoBotonSecundario]}>Crear Cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 32, fontWeight: 'bold', marginBottom: 40 },
  boton: { backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 15 },
  textoBoton: { color: '#fff', fontSize: 18, fontWeight: '600' },
  botonSecundario: { backgroundColor: '#eef5ff' },
  textoBotonSecundario: { color: '#007AFF' }
});