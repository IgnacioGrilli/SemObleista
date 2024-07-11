import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const HomeScreen = () => {
    return (
        <ImageBackground
            source={require('../../assets/background.jpg')} // Ruta de tu imagen de fondo
            style={styles.background}
            resizeMode="cover" // Opciones: cover, contain, stretch, repeat, center
        >
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    ¡Bienvenido!
                </Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover', // 'cover' o 'contain' según tu preferencia
        justifyContent: 'center', // Ajusta la imagen según sea necesario
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1, // Asegura que el contenido esté centrado verticalmente
    },
    title: {
        fontSize: 30,
        padding: 12,
        marginTop: 20,
        textAlign: 'center', // Ajusta el texto al centro si lo deseas
        color: '#fff', // Color del texto si es necesario para contrastar con la imagen de fondo
    },
});

export default HomeScreen;