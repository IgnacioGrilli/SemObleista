import React, { useEffect, useState } from "react";
import { Alert, Button, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground } from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import moment from "moment";

async function openDatabase() {
  if (Platform.OS === "web") {
    return {
      execAsync: () => { },
      runAsync: () => { },
      getFirstAsync: () => { },
      getAllAsync: () => { },
    };
  }

  return await SQLite.openDatabaseAsync("db.db");
}

const valorMinuto = 0.6;

function PatenteLista({ onPressItem }) {
  const [patentes, setPatentes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const db = await openDatabase();
      const result = await db.getAllAsync('SELECT * FROM registro_pagos_diarios');
      setPatentes(result);
    }
    fetchData();
  }, [patentes]);

  if (!patentes || patentes.length === 0) {
    return null;
  }

  return (
      <View style={styles.listArea}>
        <Text style={styles.heading}>PAGOS</Text>
        {patentes.map(({ id, patente, valor, fecha, fechaFin }) => (
            <View key={id} style={styles.listItem}>
              <View style={styles.textContainer}>
                <Text style={styles.listText}>Patente: {patente} - Monto: ${valor} - Hora Inicio: {fecha.split(' ')[1]} - Hora Fin: {fechaFin.split(' ')[1]}</Text>
              </View>
              <TouchableOpacity onPress={() => onPressItem(id)}>
                <Text style={styles.deleteIcon}>❌</Text>
              </TouchableOpacity>
            </View>
        ))}
      </View>
  );
}

export default function PagosDiarios() {
  const [patenteText, setPatenteText] = useState("");
  const [valor, setValor] = useState(0);

  useEffect(() => {
    async function setupDatabase() {
      const db = await openDatabase();
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS registro_pagos_diarios (
          id INTEGER PRIMARY KEY NOT NULL,
          patente TEXT NOT NULL,
          fecha TEXT,
          valor INTEGER NOT NULL,
          fechaFin TEXT
        );
      `);
      console.log("Tabla creada!");
    }
    setupDatabase();
  }, []);

  const add2 = async (patenteText, valor) => {
    // Validar campos
    if (!patenteText || !valor) {
      Alert.alert(
          "Campos Incompletos",
          "Complete los campos de Patente y Valor.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      return;
    }

    // Validación formato de patente
    const reg = /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})/;
    if (!reg.test(patenteText)) {
      Alert.alert(
          "Formato Incorrecto",
          "Formato de patente incorrecto (ej: AA123BB o ABC123).",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      return;
    }

    const date = moment().format('YYYY-MM-DD HH:mm');
    const sumaMinutos = valor * valorMinuto;
    const dateFIN = moment().add(sumaMinutos, 'm');
    const dateFinaux = dateFIN.format('YYYY-MM-DD HH:mm');

    const db = await openDatabase();
    await db.runAsync("INSERT INTO registro_pagos_diarios (patente, fecha, valor, fechaFin) VALUES (?, ?, ?, ?)", [patenteText, date, valor, dateFinaux]);
    console.log(`Patente ${patenteText} registrada con valor ${valor}`);

    // Limpiar los campos después de guardar
    setPatenteText("");
    setValor(0);
  };

  return (
      <ImageBackground
          source={require('../../assets/background.jpg')}
          style={styles.background}
          resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.heading}>Registro de Pagos Diario</Text>

          {Platform.OS === 'web' ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.heading}>Expo SQLite is not supported on web!</Text>
              </View>
          ) : (
              <>
                <View style={styles.flexRow}>
                  <TextInput
                      onChangeText={(text) => setPatenteText(text)}
                      value={patenteText}
                      autoCapitalize="characters"
                      maxLength={7}
                      placeholder="Patente"
                      placeholderTextColor="white"  // Ajusta el color del texto del placeholder
                      style={styles.input}


                  />
                  <TextInput
                      onChangeText={(text) => setValor(parseFloat(text))}
                      value={valor.toString()}
                      maxLength={7}
                      placeholder="Ingrese el monto a pagar"
                      style={styles.input}
                      keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.fixedButtonContainer}>
                  <Button title="$50" onPress={() => setValor(50)} />
                  <Button title="$100" onPress={() => setValor(100)} />
                  <Button title="$500" onPress={() => setValor(500)} />
                </View>

                <ScrollView style={styles.listArea}>
                  <PatenteLista
                      onPressItem={(id) =>
                          Alert.alert(
                              "Confirmación",
                              "¿Está seguro que desea eliminar este registro?",
                              [
                                { text: "Cancelar", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                                {
                                  text: "Eliminar", onPress: async () => {
                                    const db = await openDatabase();
                                    await db.runAsync("DELETE FROM registro_pagos_diarios WHERE id = ?", [id]);
                                    console.log(`Registro con id ${id} eliminado`);
                                  }
                                }
                              ]
                          )
                      }
                  />
                </ScrollView>

                <View style={styles.fixedButtonContainer}>
                  <Button
                      onPress={() => add2(patenteText, valor)}
                      title="Guardar"
                      color="orange"
                  />
                </View>
              </>
          )}
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fondo semitransparente
    padding: 16,
    marginTop: Constants.statusBarHeight,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'contain',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: 'white', // Color del texto del encabezado
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    borderColor: "#fff", // Color del borde del input
    borderRadius: 9,
    borderWidth: 3,
    flex: 1,
    height: 48,
    marginEnd: 16,
    paddingHorizontal: 8,
    color: "white", // Color del texto del input
  },
  listArea: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    flexGrow: 1,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  listText: {
    fontSize: 14,
  },
  deleteIcon: {
    fontSize: 18,
    color: '#ff0000',
  },
  fixedButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
});