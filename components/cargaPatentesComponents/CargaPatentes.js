import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { View, Text, StyleSheet, Button, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Control from './CargaPatentesController';
import CargaPatentesFetch from './CargaPatentesFetch';

const CargaPatentes = () => {

    moment().format();

    const navigation = useNavigation();

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

    return(
        <SafeAreaView>
            <View style={styles.title}>
                <Text style={styles.title}>
                Carga manual de patentes
                </Text>
                <SafeAreaView>
                    <TextInput
                        style={styles.input}
                        placeholder="Número de patente"
                    />
                </SafeAreaView>
            </View>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
            <Control 
                handleButtonPress={handleButtonPress}
            />
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