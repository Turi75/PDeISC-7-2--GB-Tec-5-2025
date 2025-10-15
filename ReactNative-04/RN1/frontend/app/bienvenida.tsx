import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PantallaBienvenida() {
  // [NUEVO] Recibimos ambos parámetros: el nombre y la bandera del primer login.
  const { nombre, esPrimerLogin } = useLocalSearchParams<{ nombre: string, esPrimerLogin: string }>();

  // Convertimos el parámetro (que es un string "true" o "false") de vuelta a un booleano.
  const primerLogin = esPrimerLogin === 'true';

  return (
    <View style={styles.contenedor}>
      {/* [NUEVO] Usamos un operador ternario para mostrar el mensaje correcto. */}
      <Text style={styles.titulo}>
        {primerLogin ? '¡Bienvenido!' : '¡Bienvenido de nuevo!'}
      </Text>
      <Text style={styles.nombreUsuario}>{nombre}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f8ff' },
  titulo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  nombreUsuario: { fontSize: 24, marginTop: 16, color: '#007AFF' },
});