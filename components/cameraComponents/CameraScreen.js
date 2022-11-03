import { Camera, CameraType } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import { BUtton, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CameraScreen = () => {

    const [cameraPermission, setCameraPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [image, setImage] = useState(null);
    const [camera, setCamera] = useState(null);

    const permissionFunction = async () => {

        const cameraPermission = await Camera.requestCameraPermissionsAsync();

        setCameraPermission(cameraPermission.status === 'granted');

    }

    const takePicture = async () => {

        const data = await camera.takePictureAsync();
        
        setImage(data.uri);

        console.log(image);

    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    useEffect(() => {
        permissionFunction();
    }, []);

    return (
        <View style={styles.container}>
            
            <View style={styles.cameraContainer}>
                <Camera 
                    ref={ref => setCamera(ref)}
                    style={styles.camera}
                    type={type}
                />
            </View>
            
            <View
                style={styles.buttonContainer}
            >
                <TouchableOpacity 
                    style={styles.button}
                    onPress={takePicture}
                >
                    <MaterialCommunityIcons 
                        name='camera' 
                        color='black' 
                        size={40}
                    />
                </TouchableOpacity>
            </View>

        </View>
    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    cameraContainer: {
        flex: 1,
        flexDirection: 'row',
    },

    camera: {
        flex: 1,
        aspectRatio: 1,
    },

    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        backgroundColor: 'orange',
        height: 80,
        width: 80,
        marginBottom: '10%',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        color: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    }

});

export default CameraScreen;