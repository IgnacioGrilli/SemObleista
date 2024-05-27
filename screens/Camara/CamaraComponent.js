import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import axios, {request} from "axios";

const CamaraComponent = () => {

    const GOOGLE_API_KEY = "AIzaSyA6va2okbZSmx9MmsuF1EPGz4CV9XQsfzw";
    const [text, setText] = useState("");
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
                await processPicture(uri);
            } catch (error) {
                console.error('Error al tomar la foto:', error);
            }
        }
    };

    const processPicture = async (uri) => {
        console.log("Procesando...");

        try {
            const base64 = await fetch(uri)
                .then(res => res.blob())
                .then(blob => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result.split(',')[1]);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                });

            const request = {
                requests: [
                    {
                        image: {
                            content: base64,
                        },
                        features: [
                            {
                                type: 'TEXT_DETECTION',
                            },
                        ],
                    },
                ],
            };

            try {
                const response = await axios.post(
                    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
                    request
                );
                const detections = response.data.responses[0].textAnnotations[0].description;
                if (detections && detections.length > 0) {
                    console.log("Response detections: ",detections);
                    console.log("Response status: ",response.status);
                    console.log("Response headers: ",response.headers);
                } else {
                    setText('No text detected');
                }
            } catch (error) {
                console.error('Error processing image: ', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                } else if (error.request) {
                    console.error('Request data:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
                setText('Failed to process image');
            }

        } catch (error) {
            console.error("OCR error: ", error);
            console.log("Procesamiento fallido.")
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                ref={(ref) => setCameraRef(ref)}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <MaterialIcons
                            style={styles.icon}
                            name="camera"
                            color="#bbbbbb"
                            size={60}
                        />
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
        width: 60,
        height: 60,
        borderRadius: 70
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default CamaraComponent;