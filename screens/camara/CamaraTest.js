import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CamaraTest = () => {

    const [cameraRef, setCameraRef] = useState(null);
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>
                    Otorgar permisos de cámara
                </Text>
                <Button onPress={requestPermission} title="Acceder" />
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const { uri } = await cameraRef.takePictureAsync();
                console.log('Foto tomada:', uri);
                await FileSystem.copyAsync({
                    from: uri,
                    to: FileSystem.documentDirectory + 'Download/Seguros/photo.jpg',
                });
                console.log('Photo saved to:', FileSystem.documentDirectory + 'photo.jpg');
            } catch (error) {
                console.error('Error al tomar la foto:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                ref={(ref) => setCameraRef(ref)}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.text}>Shoot</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 55,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default CamaraTest;