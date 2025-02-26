import React, { useState} from 'react';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import {
    View,
    Text,
    StyleSheet,
    Button,
    SafeAreaView,
    TextInput, PermissionsAndroid
} from 'react-native';

const CargaPatentes = () => {

    moment().format();

    const [patente, setPatente] = useState("");

    let date = moment()
        .format('YYYY-MM-DD');

    let hour = moment()
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

    const validateNumero = (patente) => {
        const reg = /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})/;
        return reg.test(patente);
    }

    const handleSubmit = () => {
        if (!validateNumero(patente)) {
            console.log("incorrecto");
        } else {
            console.log(patente);
            //    postRegistroOnPress(patente);
        }
    }

    const [location, setLocation] = useState(false);

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Geolocation Permission',
                    message: 'Can we access your location?',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            console.log('granted', granted);
            if (granted === 'granted') {
                console.log('You can use Geolocation');
                return true;
            } else {
                console.log('You cannot use Geolocation');
                return false;
            }
        } catch (err) {
            return false;
        }
    };

    const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
            console.log('res is:', res);
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        console.log(position);
                        setLocation(position);
                    },
                    error => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                        setLocation(false);
                    },
                    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
                );
            }
        });
        console.log(location);
    };

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
                    <Button title="Get Location" onPress={getLocation} />
                </SafeAreaView>
            </View>
        </SafeAreaView>
    )
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
    },
});

export default CargaPatentes;