import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* La pantalla de inicio no tendrá título en la barra superior */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="registro" options={{ title: 'Crear Cuenta' }} />
      <Stack.Screen name="bienvenida" options={{ title: 'Bienvenida' }} />
    </Stack>
  );
}