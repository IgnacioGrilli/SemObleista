import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import {Image, Button, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import axios from "axios";

const CamaraComponent = () => {

    const GOOGLE_API_KEY = "AIzaSyA6va2okbZSmx9MmsuF1EPGz4CV9XQsfzw";
    const [uri, setUri] = useState("");
    const [text, setText] = useState("");
    const [cameraRef, setCameraRef] = useState(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(false);

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

    const showAlert = () => {
        setModalVisible(true);
    }

    const extraerPatente = (texto) => {
        const regex = /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})/;

        const match = regex.exec(texto);
        if (match) {
            console.log("La patente identificada es: ", match[0]);
            setText(match[0]);
        }
        showAlert();
        return match ? match[1] : [];
    }

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const { uri } = await cameraRef.takePictureAsync();
                console.log('Foto tomada:', uri);
                setUri(uri);
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
                const detectionFiltered = detections.replace(/\s/g, '');
                if (detections && detections.length > 0) {
                    extraerPatente(detectionFiltered);
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
            <View style={styles.modalView}>
            <Modal visible={modalVisible} transparent={true} style={styles.modal}>
                <View style={styles.modalContent}>
                    <Image
                        style={{ width: '100%', height: 200, resizeMode: 'cover' }}
                        source={{ uri: uri }}
                    />
                    <Text style={styles.modalText}>{text}</Text>
                    <Pressable onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButton}>Close</Text>
                    </Pressable>
                </View>
            </Modal>
            </View>
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
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginHorizontal: 40,
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginHorizontal: 40,
    },
    modalContent: {
        padding: 20,
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginTop: 250,
        height: 350,
        width: 350,
        backgroundColor: 'lavender',
        borderRadius: 10,
    },
    closeButton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    modalImage: {

    },
    modalText: {
        fontSize: 26,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'black',
    }
})

export default CamaraComponent;