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

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();


function PatenteLista({ onPressItem }) {

  const [patentes, setPatentes] = useState([]);

  // console.log("presiono: ");
  // console.log(JSON.stringify(onPressItem));

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from registro_pagos_diarios`,
        [],
        (_, { rows: { _array } }) => setPatentes(_array)
      );
    });
  }, [patentes]);

  if (patentes === null || patentes.length === 0) {
    return null;
  }
  return (
    /*  <View style={styles.sectionContainer}>
       <FlatList
         data={patentes}
         keyExtractor={({ id }, index) => id}
         renderItem={({ item }) => (
           <Text>{item.id}  patente: {item.patente}  hora:  {item.fecha} valor: ${item.valor}</Text>)}
       />
     </View> */

    <View style={styles.listArea}>
      <Text style={styles.sectionHeding}>PAGOS</Text>
      {patentes.map(({ id, patente,valor,fecha }) => (
        
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
          <Text>{patente}  monto: ${valor}  hora: {fecha.split(' ')[1]} </Text>
          
          
        </TouchableOpacity>
        
      ))}
    </View>
  );
}

export default function PagosDiarios() {
  const [patentetext, setText] = useState(null);
  const [valor, setValor] = useState(0);
  // const [forceUpdate, forceUpdateId] = useForceUpdate();

  useEffect(() => {
    db.transaction((tx) => {
      //tx.executeSql('DROP TABLE IF EXISTS registro_pagos_diarios');
      //tx.executeSql(
      //"create table if not exists items (id integer primary key not null, done int, value text);"
      tx.executeSql("CREATE TABLE if not exists registro_pagos_diarios (id integer primary key not null," +
        "patente text not null, fecha text, valor integer not null)");

      //tx.executeSql("CREATE TABLE if not exists registro_pagos_diarios (patente text primary key not null);");

      //    );
      //tx.executeSql("insert into registro_pagos_diarios (patente) values (?)",["hola"]);
      console.log("tabla creada!");

    });
  }, []);

  const add2 = (patentetext, valor) => {

    // is patentetext empty?
    if (patentetext === null || patentetext === "") {
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
    var reg = /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})/

    if (!reg.test(patentetext)) {
      return Alert.alert(
        "Error",
        "Formato de patete incorrecto (ej : AA123BB o ABC123)",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    }

    var date = moment().format('YYYY-MM-DD HH:mm');
    console.log(JSON.stringify(patentetext))
    console.log(JSON.stringify(valor))

    db.transaction(
      (tx) => {
        tx.executeSql("insert into registro_pagos_diarios (patente,fecha,valor) values (?,?,?)", [patentetext, date, valor]);
        tx.executeSql("select * from registro_pagos_diarios", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      null
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Registro de Pagos Diario</Text>

      {Platform.OS === "web" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.heading}>
            Expo SQlite is not supported on web!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.flexRow}>
            <TextInput
              onChangeText={(patentetext) => setText(patentetext)}
              onSubmitEditing={() => {
                // add2(patentetext);
                //setText(null);
              }}
              autoCapitalize="characters"
              maxLength={7}
              placeholder="ingrese la patente que desea registrar"
              style={styles.input}
              value={patentetext}
            />

            <TextInput
              onChangeText={(valor) => setValor(valor)}
              onSubmitEditing={() => {
                //setValor(null);
              }}
              autoCapitalize="characters"
              maxLength={7}
              placeholder="ingrese el monto a pagar"
              style={styles.input}
              value={valor}
              keyboardType="decimal-pad"
            />
          </View>
          <View  >
            <Button
              title="50$"
             onPress={() => {setValor(50);}}
            >
            </Button>
            <Button
              title="100$"
            // onPress={() => navigation.navigate("CameraScreen")}
            >
            </Button>
            <Button
              title="500$"
            // onPress={() => navigation.navigate("CameraScreen")}
            >
            </Button>
          </View>
          


          <View style={styles.listArea}>
          <ScrollView style={styles.sectionContainer}> 
            <PatenteLista
              key={id}
              onPressItem={(id) =>
                Alert.alert(
                  "Alert",
                  "Borrar Registro ??",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { text: "OK", onPress: () =>
                    db.transaction(
                      (tx) => {
                        tx.executeSql(`delete from registro_pagos_diarios where id = ?;`, [id]);
                      },
                      null,
                      null
                    )}
                  ]
                )
                
              }
            />
            </ScrollView>
          </View>



          <View style={styles.botton}>
            <Button
              onPress={(tx) => {
                db.transaction(
                  (tx) => {
                    tx.executeSql("delete from registro_pagos_diarios");
                  },
                  null,
                  null
                );
                setText(null);
                setValor(null);
              }}
              title="borrar"
              color="green"

            />
          </View>


          <View style={styles.botton}>
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
              title="listar"
              color="blue"
            />

          </View>

          <View style={styles.botton}>
            <Button
              onPress={() => {
                add2(patentetext, valor);
                /* setText(null);
                setValor(null); */
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




/* function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
} */

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