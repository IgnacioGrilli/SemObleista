import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ToastAndroid} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NetworkStatus = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.type === "wifi")
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleButton = () => {
        if (isConnected) {
            ToastAndroid.show("Enviando...", 5);
        } else {
            ToastAndroid.show("Sin conexión.", 5);
        }
    };

    return (
        <View style={styles.container}>
            {isConnected ? (
                <View style={styles.connected}>
                    <Icon name="check-circle" size={50} color="#fff" />
                    <Text style={styles.status}>Internet is connected</Text>
                </View>
            ) : (
                <View style={styles.disconnected}>
                    <Icon name="wifi-off" size={50} color="#fff" />
                    <Text style={styles.status}>Internet is not connected</Text>
                </View>
            )}
            <View style={styles.toSend}>
                <TouchableOpacity onPress={handleButton} style={styles.button}>
                    <Icon name="send" size={50} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        borderTopColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    connected: {
        backgroundColor: 'green',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    disconnected: {
        backgroundColor: 'red',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    toSend: {
        backgroundColor: 'black',
        padding: 20,
        marginTop: 170,
        borderRadius: 10,
        alignItems: 'center',
    },
    status: {
        color: '#fff',
        fontSize: 20,
        marginVertical: 10,
    },
    button: {
        margin: 18,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
    retryCount: {
        marginTop: 20,
        fontSize: 16,
    },
});

export default NetworkStatus;