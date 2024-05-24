import {useEffect, useState} from "react";
import {Alert, Button, FlatList, Platform, StyleSheet, Text, TextInput, View} from "react-native";
import Constants from "expo-constants";
import * as SQLite from 'expo-sqlite';
import moment from "moment";
import * as Location from 'expo-location';
import {useNavigation} from '@react-navigation/native';

const dbPromise = openDatabase("db.db");

async function openDatabase(dbName) {
  if (Platform.OS === "web") {
    return null;
  }
  return await SQLite.openDatabaseAsync(dbName);
}

export default function CargaPatentesSqlite() {

  const dbName = "db.db"
  const navigation = useNavigation();
  const [patenteText, setPatenteText] = useState(null);
  const [location, setLocation] = useState(null);

  async function setupDatabase() {
    const db = await dbPromise;
    if (db) {
      await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS registro_patentes_diarios (
            id INTEGER PRIMARY KEY NOT NULL,
            patente TEXT NOT NULL,
            fecha TEXT,
            latitud REAL,
            longitud REAL
          );
        `);
      console.log(JSON.stringify(patenteText));
      setLocation(await GetCurrentLocation());
    }
  }

  async function GetCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
          "Permission not granted",
          "Allow the app to use location service.",
          [{ text: "OK" }],
          { cancelable: false }
      );
      return null;
    }

    let { coords } = await Location.getCurrentPositionAsync();
    if (coords) {
      setLocation(coords);
    }
    return coords;
  }

  useEffect(() => {
    setupDatabase().then(() =>
    console.log("Base de Datos setup."));
  }, []);

  const enviarDatos = async () => {
    const db = await dbPromise;
    if (db) {
      const listaPat = await db.getAllAsync('SELECT * FROM registro_patentes_diarios');
      console.log(JSON.stringify(listaPat.length));
      for (const item of listaPat) {
        const { patente, fecha, latitud, longitud } = item;
        const [date, hour] = fecha.split(' ');

        fetch('http://if012app.fi.mdn.unp.edu.ar:28001/registroPatentes/new', {
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
            "latitud": latitud,
            "longitud": longitud
          }),
        })
            .then((response) => response.json())
            .then((data) => {
              console.log('Success:', data);
            });
      }
    }
  };

  const add2 = async (patentetext, location) => {
    if (!patentetext || !location) return false;

    const reg = /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})/;
    if (!reg.test(patentetext)) return false;

    const db = await dbPromise;
    if (db) {
      const date = moment().format('YYYY-MM-DD HH:mm');
      await db.runAsync(
          "INSERT INTO registro_patentes_diarios (patente, fecha, latitud, longitud) VALUES (?, ?, ?, ?)",
          [patentetext, date, location.latitude, location.longitude]
      );
      const rows = await db.getAllAsync('SELECT * FROM registro_patentes_diarios');
      console.log(JSON.stringify(rows));
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.heading}>Registro de Patentes Diario</Text>

        {Platform.OS === "web" ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
              </View>
              <View>
                <Button
                    title="camara"
                    onPress={() => navigation.navigate("CameraComponent")}
                />
              </View>

              <View style={styles.listArea}>
                <PatenteLista />
              </View>

              <View>
                <Button
                    style={styles.button}
                    onPress={async () => {
                      const db = await dbPromise;
                      if (db) {
                        const rows = await db.getAllAsync('SELECT * FROM registro_patentes_diarios');
                        console.log(JSON.stringify(rows));
                      }
                    }}
                    title="Listar"
                    color="blue"
                />
              </View>

              <View>
                <Button
                    style={styles.button}
                    onPress={async () => {
                      await GetCurrentLocation();
                      await add2(patenteText, location);
                    }}
                    title="guardar"
                    color="orange"
                />
              </View>

              <View>
                <Button
                    style={styles.button}
                    onPress={async () => {
                      const db = await dbPromise;
                      if (db) {
                        await db.runAsync('DELETE FROM registro_patentes_diarios');
                      }
                    }}
                    title="borrar"
                    color="green"
                />
              </View>

              <View>
                <Button
                    style={styles.button}
                    onPress={enviarDatos}
                    title="enviar"
                    color="red"
                />
              </View>
            </>
        )}
      </View>
  );
}

function PatenteLista() {
  const [patentes, setPatentes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const db = await dbPromise;
      if (db) {
        const result = await db.getAllAsync('SELECT * FROM registro_patentes_diarios');
        setPatentes(result);
      }
    }
    fetchData();
  }, []);

  if (!patentes || patentes.length === 0) {
    return null;
  }

  return (
      <View style={styles.sectionContainer}>
        <FlatList
            data={patentes}
            keyExtractor={({ id }) => id.toString()}
            renderItem={({ item }) => (
                <Text>id: {item.id} patente: {item.patente} hora: {item.fecha}</Text>
            )}
        />
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
  button: {
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