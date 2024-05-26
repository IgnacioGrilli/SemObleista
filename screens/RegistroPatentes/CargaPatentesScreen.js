import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Button, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import CargaPatentes from '../../components/cargaPatentes/CargaPatentes';


const CargaPatentesScreen = () => {

    return(
        <View
            style={styles.screen}
        >
            <CargaPatentes/>
        </View>
    );

}

const styles = StyleSheet.create({

    screen: {
        alignItems: 'center',
        justifyContent: 'center',
    },

});

export default CargaPatentesScreen;