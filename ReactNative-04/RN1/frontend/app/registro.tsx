import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function PantallaRegistro() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  // [NUEVO] Estado para manejar el mensaje de error que se mostrará en la pantalla.
  const [error, setError] = useState('');
  const router = useRouter();

  const manejarRegistro = async () => {
    // Limpiamos errores previos al iniciar un nuevo intento.
    setError('');

    // [NUEVO] Validación en el frontend para una respuesta inmediata al usuario.
    if (!nombreCompleto || !nombreUsuario || !contrasena) {
      setError('Todos los campos son obligatorios.');
      return; // Detenemos la ejecución si hay campos vacíos.
    }
    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return; // Detenemos si la contraseña es muy corta.
    }

    setCargando(true);

    try {
      const respuesta = await fetch('http://10.0.11.154:3000/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_completo: nombreCompleto, nombre_usuario: nombreUsuario, contrasena }),
      });
      const datos = await respuesta.json();
      
      if (respuesta.ok) {
        // Usamos un alert aquí porque es una notificación de éxito, no un error de validación.
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        router.push('/login');
      } else {
        // Mostramos el error específico que nos envía el backend (ej: "usuario ya existe").
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
      <Text style={styles.titulo}>Crear Nueva Cuenta</Text>
      <TextInput style={styles.input} placeholder="Nombre Completo" value={nombreCompleto} onChangeText={setNombreCompleto} />
      <TextInput style={styles.input} placeholder="Nombre de Usuario" value={nombreUsuario} onChangeText={setNombreUsuario} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña (mín. 8 caracteres)" value={contrasena} onChangeText={setContrasena} secureTextEntry />
      
      {/* [NUEVO] Renderizado condicional del mensaje de error. */}
      {error ? <Text style={styles.textoError}>{error}</Text> : null}

      {cargando ? <ActivityIndicator size="large" color="#007AFF" /> : <Button title="Registrarse" onPress={manejarRegistro} />}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 10 },
  // [NUEVO] Estilo para el texto de error.
  textoError: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});