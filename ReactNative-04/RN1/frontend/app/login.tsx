import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function PantallaAcceso() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  // [NUEVO] Estado para manejar el error en la pantalla de login.
  const [error, setError] = useState('');
  const router = useRouter();

  const manejarIngreso = async () => {
    setError(''); // Limpiamos errores previos.
    if (!nombreUsuario || !contrasena) {
      setError('Por favor, completa ambos campos.');
      return;
    }
    setCargando(true);

    try {
      const respuesta = await fetch('http://10.0.11.154:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario: nombreUsuario, contrasena: contrasena }),
      });
      const datos = await respuesta.json();
      
      if (respuesta.ok) {
        // [NUEVO] Pasamos el dato 'esPrimerLogin' a la pantalla de bienvenida.
        // Lo convertimos a string porque los parámetros de navegación deben ser strings.
        router.push({
          pathname: "/bienvenida",
          params: {
            nombre: datos.usuario.nombre,
            esPrimerLogin: datos.esPrimerLogin.toString()
          }
        });
      } else {
        // Mostramos el error del backend (ej: "Usuario o contraseña incorrectos").
        setError(datos.mensaje);
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo más tarde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Acceso al Sistema</Text>
      <TextInput style={styles.input} placeholder="Nombre de Usuario" value={nombreUsuario} onChangeText={setNombreUsuario} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry />
      
      {/* [NUEVO] Renderizado condicional del mensaje de error. */}
      {error ? <Text style={styles.textoError}>{error}</Text> : null}

      {cargando ? <ActivityIndicator size="large" color="#007AFF" /> : <Button title="Ingresar" onPress={manejarIngreso} />}
    </View>
  );
}

// Usamos los mismos estilos que en la pantalla de registro para consistencia.
const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 10 },
  textoError: { color: 'red', textAlign: 'center', marginBottom: 10, fontSize: 16, fontWeight: '500' },
});