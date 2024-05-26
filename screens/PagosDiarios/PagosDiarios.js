import {useEffect, useState} from "react";
import {Alert, Button, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
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
                <Text style={styles.listText}>{patente} monto: ${valor} hrInicio: {fecha.split(' ')[1]} hrFIN: {fechaFin.split(' ')[1]}</Text>
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
  const [patenteText, setText] = useState(null);
  const [valor, setValor] = useState(0);
  // const [forceUpdate, forceUpdateId] = useForceUpdate();

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

  const add2 = async (patenteText, valor) => {

    // is patenteText empty?
    if (patenteText === null || patenteText === "") {
      return Alert.alert(
          "Complete el campo de patente",
          "Campo de patente incompleto",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
      );
    }

    if (valor === null || valor === "") {
      return Alert.alert(
          "Complete el campo de valor",
          "Campo de valor incompleto",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
      );
    }

    //validacion formato de patente
    const reg = /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})/;

    if (!reg.test(patenteText)) {
      return Alert.alert(
          "Error",
          "Formato de patente incorrecto (ej : AA123BB o ABC123)",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
      );
    }

    let date = moment().format('YYYY-MM-DD HH:mm');
    console.log(JSON.stringify(patenteText));
    console.log(JSON.stringify(valor));
    console.log(JSON.stringify(date));

    let sumaMinutos = (valor * valorMinuto);

    console.log(sumaMinutos);

    let dateFIN = moment().add(sumaMinutos,'m');
    let dateFinaux = dateFIN.format('YYYY-MM-DD HH:mm');

    console.log(dateFIN.format('YYYY-MM-DD HH:mm'));

    const db = await openDatabase();
    await db.runAsync("INSERT INTO registro_pagos_diarios (patente, fecha, valor, fechaFin) VALUES (?, ?, ?, ?)", [patenteText, date, valor, dateFinaux]);
    console.log(`Patente ${patenteText} registrada con valor ${valor}`);
  };

  return (
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
                    onChangeText={(patenteText) => setText(patenteText)}
                    onSubmitEditing={() => {
                      setText(null);
                    }}
                    autoCapitalize="characters"
                    maxLength={7}
                    placeholder="Ingrese la patente que desea registrar"
                    style={styles.input}
                    value={patenteText}
                />
                <TextInput
                    onChangeText={(valor) => setValor(valor)}
                    onSubmitEditing={() => {
                      setValor(null);
                    }}
                    autoCapitalize="characters"
                    maxLength={7}
                    placeholder="Ingrese el monto a pagar"
                    style={styles.input}
                    value={valor}
                    keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.fixedButtonContainer}>
                <Button title="50$" onPress={() => { setValor(50); }} />
                <Button title="100$" onPress={() => { setValor(100); }} />
                <Button title="500$" onPress={() => { setValor(500); }} />
              </View>

              <ScrollView style={styles.listArea}>
                <PatenteLista
                    onPressItem={(id) =>
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
                    }
                />
              </ScrollView>

              <View style={styles.fixedButtonContainer}>
                <Button
                    onPress={() => {
                      add2(patenteText, valor).then(() =>
                      console.log("Add2 press"));
                      setText(null);
                      setValor(null);
                    }}
                    title="Guardar"
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
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: Constants.statusBarHeight,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  listArea: {
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

  flexRowButon: {
    flexDirection: "row",
    margin: 5,
    padding: 4,
    height: 50,
    fontSize: 8,
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
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 8,
    borderRadius: 4,
  },
  deleteIcon: {
    fontSize: 18,
    color: '#ff0000',
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fixedButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
});