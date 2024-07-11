import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ToastAndroid,ImageBackground } from 'react-native';

const LoginScreen = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username === 'admin' && password === 'admin') {
            onLogin();
        } else {
            // ToastAndroid.show('Usuario o contraseña incorrectos', ToastAndroid.LONG);
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/background.jpg')} // Ruta de tu imagen de fondo
            style={styles.background}
            resizeMode="cover" // Opciones: cover, contain, stretch, repeat, center
        >
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Usuario"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <Button title="Login" onPress={handleLogin} />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    background: {
        flex: 1,
        resizeMode: 'cover', // 'cover' o 'contain' según tu preferencia
        justifyContent: 'center', // Ajusta la imagen según sea necesario
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginBottom: 12,
    },
});

export default LoginScreen;