import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Button, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import CargaPatentes from '../components/cargaPatentesComponents/CargaPatentes';


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
        backgroundColor: '#ddd'
    },

});

export default CargaPatentesScreen;