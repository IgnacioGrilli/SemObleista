import { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  FlatList,
  Alert
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import moment from "moment";

async function openDatabase() {
  if (Platform.OS === "web") {
    return {
      execAsync: () => {},
      runAsync: () => {},
      getFirstAsync: () => {},
      getAllAsync: () => {},
    };
  }

  const db = await SQLite.openDatabaseAsync("db.db");
  return db;
}

const valorMinuto = 0.6;

function PatenteLista({ onPressItem }) {
  const [patentes, setPatentes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const db = await openDatabase();
      const { rows } = await db.getAllAsync('SELECT * FROM registro_pagos_diarios');
      setPatentes(rows);
    }
    fetchData();
  }, []);

  if (patentes === null || patentes.length === 0) {
    return null;
  }

  return (
      <View style={styles.listArea}>
        <Text>PAGOS</Text>
        {patentes.map(({ id, patente, valor, fecha, fechaFin }) => (
            <TouchableOpacity
                key={id}
                onPress={() => onPressItem(id)}
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#000",
                  borderWidth: 1,
                  padding: 8,
                }}
            >
              <Text>{patente}  monto: ${valor}  hrInicio: {fecha.split(' ')[1]}  hrFIN: {fechaFin.split(' ')[1]}</Text>
            </TouchableOpacity>
        ))}
      </View>
  );
}

export default function PagosDiarios() {
  const [patentetext, setText] = useState(null);
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
      console.log("tabla creada!");
    }
    setupDatabase();
  }, []);

  const add2 = async (patentetext, valor) => {
    if (patentetext === null || patentetext === "") {
      return Alert.alert(
          "Complete el campo de patente",
          "Campo de patente incompleto",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }

    if (valor === null || valor === "") {
      return Alert.alert(
          "Complete el campo de valor",
          "Campo de valor incompleto",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }

    const reg = /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})/;
    if (!reg.test(patentetext)) {
      return Alert.alert(
          "Error",
          "Formato de patente incorrecto (ej: AA123BB o ABC123)",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }

    const date = moment().format('YYYY-MM-DD HH:mm');
    const sumaMinutos = valor * valorMinuto;
    const dateFinaux = moment().add(sumaMinutos, 'm').format('YYYY-MM-DD HH:mm');

    const db = await openDatabase();
    await db.runAsync("INSERT INTO registro_pagos_diarios (patente, fecha, valor, fechaFin) VALUES (?, ?, ?, ?)", [patentetext, date, valor, dateFinaux]);
    console.log(`Patente ${patentetext} registrada con valor ${valor}`);
  };

  return (
      <View style={styles.container}>
        <Text style={styles.heading}>Registro de Pagos Diario</Text>

        {Platform.OS === "web" ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.heading}>Expo SQlite is not supported on web!</Text>
            </View>
        ) : (
            <>
              <View style={styles.flexRow}>
                <TextInput
                    onChangeText={setText}
                    onSubmitEditing={() => { }}
                    autoCapitalize="characters"
                    maxLength={7}
                    placeholder="Ingrese la patente que desea registrar"
                    style={styles.input}
                    value={patentetext}
                />

                <TextInput
                    onChangeText={setValor}
                    onSubmitEditing={() => { }}
                    autoCapitalize="characters"
                    maxLength={7}
                    placeholder="Ingrese el monto a pagar"
                    style={styles.input}
                    value={valor.toString()}
                    keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.flexRowButon}>
                <Button title="50$" onPress={() => setValor(50)} />
                <Button title="100$" onPress={() => setValor(100)} />
                <Button title="500$" onPress={() => setValor(500)} />
              </View>

              <View style={styles.listArea}>
                <ScrollView style={styles.sectionContainer}>
                  <PatenteLista onPressItem={async (id) => {
                    Alert.alert(
                        "Alert",
                        "Borrar Registro ??",
                        [
                          { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                          {
                            text: "OK", onPress: async () => {
                              const db = await openDatabase();
                              await db.runAsync("DELETE FROM registro_pagos_diarios WHERE id = ?", [id]);
                              console.log(`Registro con id ${id} borrado`);
                            }
                          }
                        ]
                    )
                  }} />
                </ScrollView>
              </View>

              <View style={styles.botton}>
                <Button
                    onPress={async () => {
                      const db = await openDatabase();
                      await db.runAsync("DELETE FROM registro_pagos_diarios");
                      setText(null);
                      setValor(0);
                      console.log("Todos los registros borrados");
                    }}
                    title="borrar"
                    color="green"
                />
              </View>

              <View style={styles.botton}>
                <Button
                    onPress={async () => {
                      const db = await openDatabase();
                      const { rows } = await db.getAllAsync("SELECT * FROM registro_pagos_diarios");
                      console.log(JSON.stringify(rows));
                    }}
                    title="listar"
                    color="blue"
                />
              </View>

              <View style={styles.botton}>
                <Button
                    onPress={() => {
                      add2(patentetext, valor);
                      setText(null);
                      setValor(0);
                    }}
                    title="guardar"
                    color="orange"
                />
              </View>
            </>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  botton: {
    borderColor: "#4630eb",
    borderRadius: 10,
    borderWidth: 2,
    borderBottomWidth: 5,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    height: 50,
    margin: 5,
    padding: 4
  },
  flexRow: {
    flexDirection: "row",
    margin: 5,
  },
  flexRowButon: {
    flexDirection: "row",
    margin: 5,
    padding: 4,
    height: 50,
    fontSize: 8,
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  listArea: {
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
});