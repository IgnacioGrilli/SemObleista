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
} from "react-native";
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

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

/* function Items({ done: doneHeading, onPressItem }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from items where done = ?;`,
        [doneHeading ? 1 : 0],
        (_, { rows: { _array } }) => setItems(_array)
      );
    });
  }, []);

  const heading = doneHeading ? "Completed" : "Todo";

  if (items === null || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {items.map(({ id, done, value }) => (
        <TouchableOpacity
          key={id}
          onPress={() => onPressItem && onPressItem(id)}
          style={{
            backgroundColor: done ? "#1c9963" : "#fff",
            borderColor: "#000",
            borderWidth: 1,
            padding: 8,
          }}
        >
          <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
} */


function Items2({ done: doneHeading, onPressItem }) {
  const [patentes, setPatentes] = useState(null);

  //diferencia
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from registro_patentes_diarios`,
        [],
        (_, { rows: { _array } }) => setPatentes(_array)
      );
    });
  }, []);

  const heading = doneHeading ? "Completed" : "Todo";

  if (patentes === null || patentes.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {patentes.map(({ patente, done, value }) => (
        <TouchableOpacity
          key={patente}
          onPress={() => onPressItem && onPressItem(patente)}
          style={{
            backgroundColor: done ? "#1c9963" : "#fff",
            borderColor: "#000",
            borderWidth: 1,
            padding: 8,
          }}
        >
          <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}


export default function CargaPatentesSqlite() {
  const [patentetext, setText] = useState(null);
  const [forceUpdate, forceUpdateId] = useForceUpdate();



  useEffect(() => {
    db.transaction((tx) => {
      //tx.executeSql('DROP TABLE IF EXISTS registro_patentes_diarios');
      //tx.executeSql(
      //"create table if not exists items (id integer primary key not null, done int, value text);"
      /* "CREATE TABLE if not exists registro_patentes_diarios (id integer primary key not null," +
      "patente text not null, fecha text DEFAULT CURRENT_TIMESTAMP )"  */

      tx.executeSql("CREATE TABLE if not exists registro_patentes_diarios (patente text primary key not null);");

      //    );
      //tx.executeSql("insert into registro_patentes_diarios (patente) values (?)",["hola"]);
      console.log(JSON.stringify(patentetext));

    });
  }, []);

  const add2 = (patentetext) => {
    // is patentetext empty?
    if (patentetext === null || patentetext === "") {
      return false;
    }

    console.log(JSON.stringify(patentetext))

    db.transaction(
      (tx) => {
        tx.executeSql("insert into registro_patentes_diarios (patente) values (?)", [patentetext]);
        tx.executeSql("select * from registro_patentes_diarios", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      null
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Registro de Patentes Diario</Text>

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
                setText(null);
              }}
              placeholder="ingrese la patente que desea registrar"
              style={styles.input}
              value={patentetext}
            />

          </View>
          <ScrollView style={styles.listArea}>
            {/*   <Items2
              key={patentetext}
              done={false}
              onPressItem={(id) =>
                db.transaction(
                  (tx) => {
                    tx.executeSql(`update registro_patentes_diarios set fecha = "hoy" where id = ?;`, [
                      id,
                    ]);
                  },
                  null,
                  null
                )
              }
            />
            <Items2
              done
              key={patentetext}
              onPressItem={(id) =>
                db.transaction(
                  (tx) => {
                    tx.executeSql(`delete from registro_patentes_diarios where id = ?;`, [id]);
                  },
                  null,
                  null
                )
              }
            /> */}
          </ScrollView>

          <View style={styles.botton}>
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
              title="listar"
              color="blue"
            />


          </View>

          <View style={styles.botton}>
            <Button
              onPress={db.transaction(
                (tx) => {
                  tx.executeSql("insert into registro_patentes_diarios (patente) values (?)", [patentetext]);
                },
                null,
                null
              )}
              title="guardar"
              color="orange"
            />
          </View>

          <View style={styles.botton}>
            <Button
              onPress={db.transaction(
                (tx) => {
                  tx.executeSql("delete from registro_patentes_diarios");
                },
                null,
                null
              )}
              title="borrar"
              color="green"
            />
          </View>

        </>
      )}
    </View>
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
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
    backgroundColor: "#f0f0f0",
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