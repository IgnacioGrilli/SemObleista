import {useState, useEffect} from "react";
import {ActivityIndicator, Button, Platform, StyleSheet, View} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => { },
        };
      },
    };
  }

  return SQLite.openDatabaseAsync("db.db");
}

const idUsuarioObleista =2 ;
let db = openDatabase();

export default function EnvioDatos() {

  const [isLoading , setLoading] = useState(false);

  useEffect(() => {
     db = openDatabase();
  });

  const enviarDatosPagos = () => {

  //  setLoading(true);
    db.transaction(
      (tx) => {
        tx.executeSql("select * from registro_pagos_diarios", [], (_, { rows }) => enviarDataPagos(rows));
      },
      null,
      null
    );

    const enviarDataPagos = (listaPatPagos) => {

      //f (listaPatPagos.id = 1)
      console.log(JSON.stringify(listaPatPagos.length));

      const len = listaPatPagos.length;
      let i;
      for (i = 0; i < len; i++) {

        var patente = listaPatPagos.item(i).patente;

        var date = listaPatPagos.item(i).fecha.split(' ')[0];

        var hotaInicioPago = listaPatPagos.item(i).fecha.split(' ')[1];

        var valor = listaPatPagos.item(i).valor;

        var hrFin = listaPatPagos.item(i).fechaFin.split(' ')[1];

        console.log(patente + " " + date + " " + hotaInicioPago + " "+ valor + " ", hrFin) ;

        fetch('http://if012app.fi.mdn.unp.edu.ar:28001/registroPagos/new', {
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
              "horaInicio": hotaInicioPago,
               "horaFin" : hrFin, //aca deberia hacer el calculo de las horas que 
              "valor": valor
          }),    
      })
      .then((response) => response.json())
      .then((data) => {
          console.log('Success:', data);
        //  setLoading(false);
          //setId(data.id);
          /* setPatente((id) => {
              console.log(id);
          }); */
      });


      }


    };
  }

  const enviarDatosRegistros = () => {

  //  setLoading(true);
    db.transaction(
      (tx) => {
        tx.executeSql("select * from registro_patentes_diarios", [], (_, { rows }) => enviarData(rows));
      },
      null,
      null
    );

    const enviarData = (listaPat) => {

      //f (listaPat.id = 1)
      console.log(JSON.stringify(listaPat.length));



      const len = listaPat.length;
      let i;
      for (i = 0; i < len; i++) {



        var patente = listaPat.item(i).patente;

        var date = listaPat.item(i).fecha.split(' ')[0];

        var hour = listaPat.item(i).fecha.split(' ')[1];

        var lat = listaPat.item(i).latitud;

        var longi = listaPat.item(i).longitud;

        console.log(patente + " " + date + " " + hour);

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
            "latitud": lat,
            "longitud": longi
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
          //  setLoading(false);
          });


      }


    };
  }


  const eliminarDAtos = () => {

    

    db.transaction(
      (tx) => {
        tx.executeSql("delete from registro_pagos_diarios");
      },
      null,
      null
    );

    db.transaction(
      (tx) => {
        tx.executeSql("delete from registro_patentes_diarios");
      },
      null,
      null
    )

    


  }

  return (
    <View style={styles.container}>

      {!isLoading ? (
      <Button
        onPress={() => {
          setLoading(true);
         enviarDatosRegistros();
          enviarDatosPagos();
          eliminarDAtos();
          setLoading(false);
        }}
        title="Enviar Datos"
        color="orange"
      />
      ) : ( <ActivityIndicator animating={true}/>)
      }

      <Button
        onPress={(tx) => db.transaction(
          (tx) => {
            tx.executeSql("select * from registro_pagos_diarios", [], (_, { rows }) =>
              console.log(JSON.stringify(rows))
            );
          },
          null,
          null
        )}
        title="listar Pagos"
        color="blue"
      />

<Button
        onPress={(tx) => db.transaction(
          (tx) => {
            tx.executeSql("select * from registro_patentes_diarios", [], (_, { rows }) =>
              console.log(JSON.stringify(rows))
            );
          },
          null,
          null
        )}
        title="listar Resgistros"
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
    // backgroundColor: "#f0f0f0",
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