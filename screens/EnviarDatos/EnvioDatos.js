import {useState} from "react";
import {ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

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

  const enviarDatosPagos = async () => {
    //setLoading(true);
    const db = await openDatabase();
    const  rows  = await db.getAllAsync('SELECT * FROM registro_pagos_diarios');
    console.log('data pagos', rows);
    await enviarDataPagos(rows);
    // setLoading(false);
  };

  const eliminarDatos = async () => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM registro_pagos_diarios');
    await db.runAsync('DELETE FROM registro_patentes_diarios');
    console.log('Datos eliminados');
  };

  const enviarDataPagos = async (listaPatPagos) => {
    const len = listaPatPagos.length;
    for (let i = 0; i < len; i++) {
      const item = listaPatPagos[i];
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
    // setLoading(true);

    const db = await openDatabase();

    const result = await db.getAllAsync('SELECT * FROM registro_patentes_diarios');
    //console.log('data',result);
    // const rows = result.rows._array || result.rows; // Asegúrate de tener los datos en formato de array
    //  console.log('data',rows);
    await enviarData(result);
    //  setLoading(false);
  };

  const enviarData = async (listaPat) => {
    const len = listaPat.length;
    for (let i = 0; i < len; i++) {
      const item = listaPat[i]; // Accede directamente como un array
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

  return (<ScrollView style={styles.container} stickyHeaderIndices={[0]} >
        <View style={styles.header}>
          <Text style={styles.title}>Gestión de Patentes</Text>
          {!isLoading ? (
              <TouchableOpacity
                  style={[styles.button, styles.sendButton]}
                  onPress={async () => {
                    //  setLoading(true);
                    await enviarDatosRegistros();
                    await enviarDatosPagos();
                    await eliminarDatos();
                    //  setLoading(false);
                  }}
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

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 16,
  },
  header: {
    backgroundColor: "#0288d1",
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#4caf50",
    marginRight: 8,
  },
  listButton: {
    backgroundColor: "#1976d4",
    marginRight: 8,
  },
  listArea: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listText: {
    fontSize: 16,
  },
});