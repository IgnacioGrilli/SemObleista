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
  FlatList
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import moment from "moment";
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

//import Ubicacion from "../../screens/Geolocalizacion";
//import CameraScrenn from "../../screens/cameraScrenn/CameraScrenn";


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

const db = openDatabase();


//const [location, setLocation] = useState(null);


export default function CargaPatentesSqlite() {

  const navigation = useNavigation();
  const [patentetext, setText] = useState(null);
  const [location, setLocation] = useState(null);


  // const [forceUpdate, forceUpdateId] = useForceUpdate();

  useEffect(() => {
    db.transaction((tx) => {
      //tx.executeSql('DROP TABLE IF EXISTS registro_patentes_diarios');
      tx.executeSql("CREATE TABLE if not exists registro_patentes_diarios (id integer primary key not null," +
        "patente text not null, fecha text, latitud real, longitud real)");
      console.log(JSON.stringify(patentetext));
      setLocation(GetCurrentLocation());


    });
  }, []);


  async function GetCurrentLocation() {


    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use location service.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();


    if (coords) {
      const { latitude, longitude } = coords;
      setLocation(coords);

      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      //return coords;

      /* for (let item of response) {
        let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
  
        setUserLocation(address);
      } */
    }

    console.log(" cooredenadas dentro del GetCurrent " + coords.latitude);
    return coords;

  };


  const enviarDatos = () => {

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
          });


      }


    };
  }

  const add2 = (patentetext, location) => {

    console.log("location en el add: ");
    console.log(JSON.stringify("lati: " + location.latitude + "longi: " + location.longitude));

    // is patentetext empty?
    if (patentetext === null || patentetext === "") {
      return false;
    }

    //validacion formato de patente
    var reg = /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})/

    if (!reg.test(patentetext)) {
      return false;
    }


    var date = moment().format('YYYY-MM-DD HH:mm');
    console.log(JSON.stringify(patentetext))
    db.transaction(
      (tx) => {
        tx.executeSql("insert into registro_patentes_diarios (patente,fecha,latitud,longitud) values (?,?,?,?)", [patentetext, date, location.latitude, location.longitude]);
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
                //add2(patentetext);
                setText(null);
              }}
              autoCapitalize="characters"
              maxLength={7}
              placeholder="ingrese la patente que desea registrar"
              style={styles.input}
              value={patentetext}
            />
          </View>
          <View  >
            <Button
              title="camara"
              onPress={() => navigation.navigate("CameraScreen")}
            >
            </Button>
          </View>



          <View style={styles.listArea}>
            <PatenteLista />
          </View>


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
              onPress={() => {
                // setText(null);
                GetCurrentLocation();
                add2(patentetext, location);

              }}
              title="guardar"
              color="orange"
            />
          </View>
          <View style={styles.botton}>
            <Button
              onPress={(tx) => db.transaction(
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

          <View style={styles.botton}>
            <Button
              onPress={() => enviarDatos()}
              title="enviar"
              color="red"
            />
          </View>

        </>
      )}
    </View>
  );
}

function PatenteLista({ }) {


  const [patentes, setPatentes] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from registro_patentes_diarios`,
        [],
        (_, { rows: { _array } }) => setPatentes(_array)
      );
    });
  }, [patentes]);

  if (patentes === null || patentes.length === 0) {
    return null;
  }
  return (
    <View style={styles.sectionContainer}>
      <FlatList
        data={patentes}
        keyExtractor={({ id }, index) => id}
        renderItem={({ item }) => (
          <Text>id : {item.id}   patente: {item.patente}  hora:  {item.fecha}</Text>)}
      />
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
    //  backgroundColor: "#f0f0f0",
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


/*   const ejemplo = () => {

    const obleista = 2;

    var patente = 'AAA000';

    var date = moment()
      .format('YYYY-MM-DD');

    var hour = moment()
      .utcOffset('+00:00')
      .format('HH:mm');

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
        "hora": hour
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      });
  } */