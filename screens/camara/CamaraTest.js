import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera';

const CamaraTest = () => {
    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});

export default CamaraTest;