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
  Alert,
  ActivityIndicator
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

const idUsuarioObleista = 2;

export default function EnvioDatos() {
  const [isLoading, setLoading] = useState(false);

  const enviarDatosPagos = async () => {
    setLoading(true);
    const db = await openDatabase();
    const { rows } = await db.getAllAsync('SELECT * FROM registro_pagos_diarios');
    await enviarDataPagos(rows);
    setLoading(false);
  };

  const enviarDataPagos = async (listaPatPagos) => {
    const len = listaPatPagos.length;
    for (let i = 0; i < len; i++) {
      const item = listaPatPagos.item(i);
      const patente = item.patente;
      const date = item.fecha.split(' ')[0];
      const horaInicioPago = item.fecha.split(' ')[1];
      const valor = item.valor;
      const hrFin = item.fechaFin.split(' ')[1];

      console.log(patente + " " + date + " " + horaInicioPago + " " + valor + " " + hrFin);

      await fetch('http://if012app.fi.mdn.unp.edu.ar:28001/registroPagos/new', {
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
      })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
          });
    }
  };

  const enviarDatosRegistros = async () => {
    setLoading(true);
    const db = await openDatabase();
    const { rows } = await db.getAllAsync('SELECT * FROM registro_patentes_diarios');
    await enviarData(rows);
    setLoading(false);
  };

  const enviarData = async (listaPat) => {
    const len = listaPat.length;
    for (let i = 0; i < len; i++) {
      const item = listaPat.item(i);
      const patente = item.patente;
      const date = item.fecha.split(' ')[0];
      const hour = item.fecha.split(' ')[1];
      const lat = item.latitud;
      const longi = item.longitud;

      console.log(patente + " " + date + " " + hour);

      await fetch('http://if012app.fi.mdn.unp.edu.ar:28001/registroPatentes/new', {
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
      })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
          });
    }
  };

  const eliminarDAtos = async () => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM registro_pagos_diarios');
    await db.runAsync('DELETE FROM registro_patentes_diarios');
    console.log('Datos eliminados');
  };

  return (
      <View style={styles.container}>
        {!isLoading ? (
            <Button
                onPress={async () => {
                  setLoading(true);
                  await enviarDatosRegistros();
                  await enviarDatosPagos();
                  await eliminarDAtos();
                  setLoading(false);
                }}
                title="Enviar Datos"
                color="orange"
            />
        ) : (
            <ActivityIndicator animating={true} />
        )}

        <Button
            onPress={async () => {
              const db = await openDatabase();
              const { rows } = await db.getAllAsync('SELECT * FROM registro_pagos_diarios');
              console.log(JSON.stringify(rows));
            }}
            title="listar Pagos"
            color="blue"
        />

        <Button
            onPress={async () => {
              const db = await openDatabase();
              const { rows } = await db.getAllAsync('SELECT * FROM registro_patentes_diarios');
              console.log(JSON.stringify(rows));
            }}
            title="listar Registros"
            color="blue"
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