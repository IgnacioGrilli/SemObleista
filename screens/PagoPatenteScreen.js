import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { View, SafeAreaView, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const PagoPatenteScreen = () => {

    const navigation = useNavigation();

    const postPagoOnPress = (patente, cantMinutos) => {

        var date = moment()
        .format('YYYY-MM-DD');

        var hour = moment()
        .utcOffset('+00:00')
        .format('HH:mm');

        var finalHour = moment()
        .add(cantMinutos, 'minutes')
        .utcOffset('+00:00')
        .format('HH:mm')

        fetch('http://if012app.fi.mdn.unp.edu.ar:28001/registroPagos/new', {
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
                "horaInicio": hour,
                "horaFin": finalHour,
                "valor": 101 
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        });
    }

    const [patente, setPatente] = useState("");
    const [cantMinutos, setCantMinutos] = useState("");

    const validateNumero = (patente, cantMinutos) => {

        if (patente === null || patente === "") {
            alert("Por favor ingrese el número de patente.");
            return false;
        }

        if (cantMinutos === null || cantMinutos === "") {
            alert("Por favor ingrese la cantidad de minutos.");
            return false;
        }

        var reg = /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})/
        return reg.test(patente);
    }

    const handleSubmit = () => {
        if (!validateNumero(patente)) {
            console.log("Formato incorrecto.");
        } else {
            console.log(patente);
            postPagoOnPress(patente, cantMinutos);
        }
    }

    return(
        <SafeAreaView>
            <View style={styles.title}>
                <Text style={styles.title}>
                Pago en efectivo de patentes
                </Text>
                <SafeAreaView>
                    <TextInput
                        style={styles.input}
                        placeholder="Número de patente"
                        onChangeText={(text) => setPatente(text)}
                        autoCapitalize="characters"
                        maxLength={7}
                        value={patente}
                    />
                </SafeAreaView>
                <SafeAreaView>
                    <TextInput
                        style={styles.input}
                        placeholder="Cantidad de minutos"
                        onChangeText={(number) => setCantMinutos(number)}
                        keyboardType='numeric'
                        maxLength={3}
                        value={cantMinutos}
                    />
                </SafeAreaView>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        handleSubmit(patente, cantMinutos);
                        setPatente("");
                        setCantMinutos("");
                    }}
                >
                    <SafeAreaView>
                        <Text
                            style={styles.text}
                        >
                            Ingresar
                        </Text>
                    </SafeAreaView>
                </TouchableOpacity>
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
        marginTop: 30,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff'
    },

    text: {
        fontSize: 20,
        color: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        height: 35,
        width: 180,
        backgroundColor: 'orange',
        marginTop: 70,
        borderWidth: 1,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    }

});

export default PagoPatenteScreen;