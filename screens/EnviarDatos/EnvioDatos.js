import React, { useState, useEffect } from 'react';
import {ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ToastAndroid,ImageBackground} from 'react-native';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

async function openDatabase() {
  if (Platform.OS === "web") {
    return {
      execAsync: () => {},
      runAsync: () => {},
      getFirstAsync: () => {},
      getAllAsync: () => {},
    };
  }

  return await SQLite.openDatabaseAsync("db.db");
}

const idUsuarioObleista = 2;

export default function EnvioDatos() {
  const [isLoading, setLoading] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [mostrarPagos, setMostrarPagos] = useState(false);
  const [mostrarRegistros, setMostrarRegistros] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const enviarDatosPagos = async () => {
    const db = await openDatabase();
    const rows = await db.getAllAsync('SELECT * FROM registro_pagos_diarios');
    console.log('data pagos', rows);
    const success = await enviarDataPagos(rows);
    if (success) {
      await eliminarDatosPagos();
    }
  };

  const eliminarDatosPagos = async () => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM registro_pagos_diarios');
    console.log('Datos de pagos eliminados');
  };

  const enviarDataPagos = async (listaPatPagos) => {
    let allSuccess = true;
    const len = listaPatPagos.length;
    for (let i = 0; i < len; i++) {
      const item = listaPatPagos[i];
      const patente = item.patente;
      const date = item.fecha.split(' ')[0];
      const horaInicioPago = item.fecha.split(' ')[1];
      const valor = item.valor;
      const hrFin = item.fechaFin.split(' ')[1];

      console.log(patente + " " + date + " " + horaInicioPago + " " + valor + " " + hrFin);

      try {
        const response = await fetch('http://if012app.fi.mdn.unp.edu.ar:28001/registroPagos/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "patente": {
              "numero": patente,
            },
            "fecha": date,
            "usuarioObleista": {
              "id": idUsuarioObleista
            },
            "horaInicio": horaInicioPago,
            "horaFin": hrFin,
            "valor": valor
          }),
        });

        const data = await response.json();
        console.log('Success:', data);

      } catch (error) {
        console.error('Error:', error);
        ToastAndroid.show(`Error al enviar datos de pagos: ${error.message}`, ToastAndroid.LONG);
        allSuccess = false;
      }
    }
    return allSuccess;
  };

  const enviarDatosRegistros = async () => {
    const db = await openDatabase();
    const result = await db.getAllAsync('SELECT * FROM registro_patentes_diarios');
    const success = await enviarData(result);
    if (success) {
      await eliminarDatosRegistros();
    }
  };

  const eliminarDatosRegistros = async () => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM registro_patentes_diarios');
    console.log('Datos de registros eliminados');
  };

  const enviarData = async (listaPat) => {
    let allSuccess = true;
    const len = listaPat.length;
    for (let i = 0; i < len; i++) {
      const item = listaPat[i];
      const patente = item.patente;
      const date = item.fecha.split(' ')[0];
      const hour = item.fecha.split(' ')[1];
      const lat = item.latitud;
      const longi = item.longitud;

      console.log(patente + " " + date + " " + hour);

      try {
        const response = await fetch('http://if012app.fi.mdn.unp.edu.ar:28001/registroPatentes/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "usuarioObleista": {
              "id": 2
            },
            "patente": {
              "numero": patente
            },
            "fecha": date,
            "hora": hour,
            "latitud": lat,
            "longitud": longi
          }),
        });

        const data = await response.json();
        console.log('Success:', data);

      } catch (error) {
        console.error('Error:', error);
        ToastAndroid.show(`Error al enviar datos de registros: ${error.message}`, ToastAndroid.LONG);
        allSuccess = false;
      }
    }
    return allSuccess;
  };

  const listarPagos = async () => {
    setMostrarPagos(true);
    setMostrarRegistros(false);
    const db = await openDatabase();
    const allRows = await db.getAllAsync("SELECT * FROM registro_pagos_diarios");
    setPagos(allRows);
  };

  const listarRegistros = async () => {
    setMostrarRegistros(true);
    setMostrarPagos(false);
    const db = await openDatabase();
    const allRows = await db.getAllAsync('SELECT * FROM registro_patentes_diarios');
    setRegistros(allRows);
  };

  const handleEnviarDatos = async () => {
    if (isConnected) {
      ToastAndroid.show("Enviando...", ToastAndroid.LONG);
      setLoading(true);
      try {
        await enviarDatosRegistros();
        await enviarDatosPagos();
        // ToastAndroid.show("Datos enviados y eliminados exitosamente.", ToastAndroid.LONG);
      } catch (error) {
        console.error('Error:', error);
        ToastAndroid.show(`Error al enviar los datos: ${error.message}`, ToastAndroid.LONG);
      } finally {
        setLoading(false);
      }
    } else {
      ToastAndroid.show("Sin conexión.", ToastAndroid.LONG);
    }
  };

  return (
      <ImageBackground
          source={require('../../assets/background.jpg')} // Ruta de tu imagen de fondo
          style={styles.background}
          resizeMode="cover" // Ajusta la imagen según sea necesario: cover, contain, stretch, repeat, center
      >
        <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
          <View style={styles.header}>
            <Text style={styles.title}>Gestión de Patentes</Text>
            {!isLoading ? (
                <TouchableOpacity
                    style={[styles.button, styles.sendButton]}
                    onPress={handleEnviarDatos}
                >
                  <Text style={styles.buttonText}>Enviar Datos</Text>
                </TouchableOpacity>
            ) : (
                <ActivityIndicator animating={true} size="large" color="#0000ff" />
            )}

            <TouchableOpacity
                style={[styles.button, styles.listButton]}
                onPress={listarPagos}
            >
              <Text style={styles.buttonText}>Listar Pagos</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.listButton]}
                onPress={listarRegistros}
            >
              <Text style={styles.buttonText}>Listar Registros</Text>
            </TouchableOpacity>
          </View>

          {isConnected ? (
              <View style={styles.connected}>
                <Icon name="check-circle" size={50} color="#fff" />
                <Text style={styles.status}>Internet is connected</Text>
              </View>
          ) : (
              <View style={styles.disconnected}>
                <Icon name="wifi-off" size={50} color="#fff" />
                <Text style={styles.status}>Internet is not connected</Text>
              </View>
          )}

          {mostrarPagos && pagos.length > 0 && (
              <View style={styles.listArea}>
                <Text style={styles.sectionHeading}>Pagos:</Text>
                {pagos.map((row, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.listText}>{row.patente} - {row.fecha}</Text>
                    </View>
                ))}
              </View>
          )}

          {mostrarRegistros && registros.length > 0 && (
              <View style={styles.listArea}>
                <Text style={styles.sectionHeading}>Registros:</Text>
                {registros.map((row, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.listText}>{row.patente} - {row.fecha}</Text>
                    </View>
                ))}
              </View>
          )}
        </ScrollView>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 16,
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // 'cover' o 'contain' según tu preferencia
    justifyContent: 'contain', // Ajusta la imagen según sea necesario
  },
  header: {

    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    backgroundColor: "#4caf50",
    marginBottom: 10,
  },
  listButton: {
    backgroundColor: "#03a9f4",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  connected: {
    backgroundColor: "#4caf50",
    paddingVertical: 2,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15, // Ajusta el valor según el redondeo que desees
  },
  disconnected: {
    backgroundColor: "#f44336",
    paddingVertical: 2,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  status: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 8,
  },
  listArea: {
    marginTop: 16,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listText: {
    fontSize: 16,
  },
});