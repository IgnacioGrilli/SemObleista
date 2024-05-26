import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = () => {

    const navigation = useNavigation();

    return(

        <View style={styles.titleContainer}>
            <Text style={styles.title}>
                !Bienvenido!
            </Text>
        </View>
    
    );

}

const styles = StyleSheet.create({
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        padding: 12,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

});

export default HomeScreen;