import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = () => {

    const navigation = useNavigation();

    return(

        <View style={styles.title}>
            <Text style={styles.title}>
                Bienvenido al SEM obleista!
            </Text>
            <Button
                title="camara"
                onPress={() => navigation.navigate("CameraScreen")}
            >
            </Button>
        </View>
    
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

});

export default HomeScreen;