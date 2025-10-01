import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Modal,
  Alert,
} from 'react-native';

export default function HomeScreen() { // Cambiamos el nombre de la función por convención
  // Estados para manejar la interactividad de los componentes
  const [textoInput, setTextoInput] = useState('');
  const [switchActivado, setSwitchActivado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const mostrarAlerta = () => {
    Alert.alert(
      'Alerta de Ejemplo',
      'Presionaste el botón para mostrar esta alerta.',
      [{ text: 'OK' }],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Componentes Nativos con Expo</Text>
        </View>

        {/* ==================== View ==================== */}
        <View style={styles.card}>
          <Text style={styles.title}>View</Text>
          <Text style={styles.description}>
            El contenedor más básico para agrupar otros componentes y aplicar estilos. Es el `div` de React Native.
          </Text>
          <View style={styles.viewExample}>
            <Text style={styles.lightText}>Este texto está dentro de un View</Text>
          </View>
        </View>

        {/* ==================== Text ==================== */}
        <View style={styles.card}>
          <Text style={styles.title}>Text</Text>
          <Text style={styles.description}>
            Para mostrar cualquier cadena de texto.
          </Text>
        </View>

        {/* ==================== Image ==================== */}
        <View style={styles.card}>
          <Text style={styles.title}>Image</Text>
          <Text style={styles.description}>
            Muestra imágenes desde una URL (`uri`) o desde archivos locales (`require`).
          </Text>
          <Image
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            style={styles.imageExample}
          />
        </View>

        {/* ==================== TextInput ==================== */}
        <View style={styles.card}>
          <Text style={styles.title}>TextInput</Text>
          <Text style={styles.description}>
            Un campo de texto para que el usuario ingrese datos.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe algo aquí..."
            placeholderTextColor="#888"
            value={textoInput}
            onChangeText={setTextoInput}
          />
        </View>

        {/* ==================== Button & TouchableOpacity ==================== */}
        <View style={styles.card}>
          <Text style={styles.title}>Button & TouchableOpacity</Text>
          <Text style={styles.description}>
            Componentes para manejar toques. <Text style={styles.bold}>Button</Text> es simple. <Text style={styles.bold}>TouchableOpacity</Text> es totalmente personalizable.
          </Text>
          <Button title="Button Básico" onPress={mostrarAlerta} color="#007AFF" />
          <TouchableOpacity style={styles.touchable} onPress={mostrarAlerta}>
            <Text style={styles.touchableText}>TouchableOpacity</Text>
          </TouchableOpacity>
        </View>

        {/* ==================== ActivityIndicator ==================== */}
        <View style={styles.card}>
          <Text style={styles.title}>ActivityIndicator</Text>
          <Text style={styles.description}>
            Muestra un indicador de carga (spinner) para operaciones en proceso.
          </Text>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>

        {/* ==================== Switch ==================== */}
        <View style={styles.card}>
          <Text style={styles.title}>Switch</Text>
          <Text style={styles.description}>
            Un interruptor para valores de verdadero/falso.
          </Text>
          <View style={styles.switchContainer}>
            <Text style={styles.lightText}>
              Estado: {switchActivado ? 'Activado' : 'Desactivado'}
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={switchActivado ? '#007AFF' : '#f4f3f4'}
              onValueChange={() => setSwitchActivado(previous => !previous)}
              value={switchActivado}
            />
          </View>
        </View>

        {/* ==================== Modal ==================== */}
        <View style={styles.card}>
          <Text style={styles.title}>Modal</Text>
          <Text style={styles.description}>
            Presenta contenido en una ventana que se superpone a la vista principal.
          </Text>
          <Button title="Mostrar Modal" onPress={() => setModalVisible(true)} color="#007AFF" />
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>¡Hola, soy un Modal!</Text>
                <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#FF3B30" />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  scrollViewContainer: { paddingBottom: 20, backgroundColor: '#121212' },
  header: { padding: 24, backgroundColor: '#1a1a1a' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
    elevation: 3,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#007AFF', marginBottom: 10 },
  description: { fontSize: 16, color: '#e0e0e0', lineHeight: 24, marginBottom: 15 },
  lightText: { color: '#f0f0f0', fontSize: 16 },
  bold: { fontWeight: 'bold' },
  viewExample: { backgroundColor: '#333', padding: 15, borderRadius: 8, alignItems: 'center' },
  imageExample: { width: 60, height: 60, alignSelf: 'center' },
  input: {
    height: 50,
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  touchable: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  touchableText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#2c2c2c',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  modalText: { marginBottom: 20, textAlign: 'center', fontSize: 18, color: '#f0f0f0' },
});