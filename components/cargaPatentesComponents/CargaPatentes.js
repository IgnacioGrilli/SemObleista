import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import * as SQLite from 'expo-sqlite';
import { View, Text, StyleSheet, Button, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Control from './CargaPatentesController';
import CargaPatentesFetch from './CargaPatentesFetch';

/*
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

    function patentes({}) {
        const [patentes, setPatentes] = useState(null);

        useEffect(() => {
            db.transaction((tx) => {
                tx.executeSql(
                    'select * from patentes',
                    [],
                );
            });
        }, []);
    }

    function cargaPatente() {

        useEffect(() => {
            db.transaction((tx) => {
                tx.executeSql(
                    'create table if not exists registroPatentes( ' +
                    'id INTEGER PRIMARY KEY NOT NULL, ' +
                    'obleista INTEGER NOT NULL, ' +
                    'patente TEXT NOT NULL, ' +
                    'fecha TEXT NOT NULL, ' +
                    'hora TEXT NOT NULL);'
                );
            });
        }, []);

        const add = (obleista, numero, fecha, hora) => {
            if (text === null || text === "") {
                return false;
            }

            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO patentes ' +
                    '(obleista, patente, fecha, hora) ' + 
                    'VALUES ' +
                    '(?, ?, ?, ?)',
                    [obleista, numero, fecha, hora]
                );
            });
        };
    }

    const handleButtonPress = () => {

        var obleista = '2';

        var numero = 'IHP555';

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
                obleistaid: obleista,
                patenteid: numero,
                fecha: date,
                hora: hour
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        });
    }
*/


const CargaPatentes = () => {

    const navigation = useNavigation();

    const [patente, setPatente] = useState("");

    const validateNumero = (patente) => {
        var reg = /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})/
        return reg.test(patente);
    }

    const handleSubmit = () => {
        if (!validateNumero(patente)) {
            console.log("flashaste pa");
        } else {
            console.log(patente);
        }
    }

    return(
        <SafeAreaView>
            <View style={styles.title}>
                <Text style={styles.title}>
                Control diario de patentes
                </Text>
                <SafeAreaView>
                    <TextInput
                        style={styles.input}
                        placeholder="Número de patente"
                        onChangeText={(text) => setPatente(text)}
                        onSubmitEditing={() => {
                            handleSubmit(patente);
                            setPatente("");
                        }}
                        autoCapitalize="characters"
                        maxLength={7}
                        value={patente}
                    />
                </SafeAreaView>
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({

    title: {
        fontSize: 30,
        color: '#000',
        padding: 12,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    input: {
        height: 45,
        width: 250,
        marginTop: 120,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff'
    },

    button: {
        backgroundColor: 'orange',
        height: 80,
        width: 80,
        marginTop: 180,
        borderWidth: 1,
        padding: 10,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }

});

export default CargaPatentes;