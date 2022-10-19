import { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

function Items({ done: doneHeading, onPressItem }) {
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
}

export default function CargaPatentesSqlite() {
  const [text, setText] = useState(null);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
       "create table if not exists items (id integer primary key not null, done int, value text);"
        //"CREATE TABLE if not exists registro_patentes_diarios (id bigserial NOT NULL,fecha date NULL,hora time NULL,patenteid varchar(255) NULL, obleistaid int4 NULL)"

      );
    });
  }, []);

  const add = (text) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql("insert into items (done, value) values (0, ?)", [text]);
        tx.executeSql("select * from items", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      forceUpdate
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SQLite Example</Text>

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
              onChangeText={(text) => setText(text)}
              onSubmitEditing={() => {
                add(text);
                setText(null);
              }}
              placeholder="what do you need to do?"
              style={styles.input}
              value={text}
            />
          </View>
          <ScrollView style={styles.listArea}>
            <Items
              key={`forceupdate-todo-${forceUpdateId}`}
              done={false}
              onPressItem={(id) =>
                db.transaction(
                  (tx) => {
                    tx.executeSql(`update items set done = 1 where id = ?;`, [
                      id,
                    ]);
                  },
                  null,
                  forceUpdate
                )
              }
            />
            <Items
              done
              key={`forceupdate-done-${forceUpdateId}`}
              onPressItem={(id) =>
                db.transaction(
                  (tx) => {
                    tx.executeSql(`delete from items where id = ?;`, [id]);
                  },
                  null,
                  forceUpdate
                )
              }
            />
          </ScrollView>
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


/* import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite'
import { useNavigation } from '@react-navigation/native';



const db = SQLite.openDatabase('db.testDb') // returns Database object

class CargaItem extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        data: null
      }
      // Check if the items table exists if not create it
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, count INT)'
        )
      })
      this.fetchData() // ignore it for now
    }
    render() {
      return (
          <View style={Style.main}>
          <Text>Add Random Name with Counts</Text>
          <TouchableOpacity onPress={this.newItem} style={Style.green}>
            <Text style={Style.white}>Add New Item</Text>
          </TouchableOpacity>
  
          <ScrollView style={Style.widthfull}>
          {
              this.state.data && this.state.data.map(data =>
              (
                  <View key={data.id} style={Style.list}>
                  <Text >{data.text} - {data.count}</Text>
                  <TouchableOpacity onPress={() => this.increment(data.id)}>
                      <Text style={Style.boldGreen}> + </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.delete(data.id)}>
                      <Text style={Style.boldRed}> DEL </Text>
                  </TouchableOpacity>
                  </View>
              )
          )}
          </ScrollView>
        </View >
      )
    }
  }
  export default CargaItem
  // Styles are removed purpose-fully 


  fetchData = () => {
    db.transaction(tx => {
      // sending 4 arguments in executeSql
      tx.executeSql('SELECT * FROM items', null, // passing sql query and parameters:null
        // success callback which sends two things Transaction object and ResultSet Object
        (txObj, { rows: { _array } }) => this.setState({ data: _array }),
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => console.log('Error ', error)
        ) // end executeSQL
    }) // end transaction
  }

  // event handler for new item creation
 newItem = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO items (text, count) values (?, ?)', ['gibberish', 0],
        (txObj, resultSet) => this.setState({ data: this.state.data.concat(
            { id: resultSet.insertId, text: 'gibberish', count: 0 }) }),
        (txObj, error) => console.log('Error', error))
    })
  }

  increment = (id) => {
    db.transaction(tx => {
      tx.executeSql('UPDATE items SET count = count + 1 WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let newList = this.state.data.map(data => {
              if (data.id === id)
                return { ...data, count: data.count + 1 }
              else
                return data
            })
            this.setState({ data: newList })
          }
        })
    })
  }

  delete = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM items WHERE id = ? ', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let newList = this.state.data.filter(data => {
              if (data.id === id)
                return false
              else
                return true
            })
            this.setState({ data: newList })
          }
        })
    })
  } */

