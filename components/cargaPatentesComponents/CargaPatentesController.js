import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

function Control({ handleButtonPress }) {

    return(
        <View>
        <TouchableOpacity
            style={styles.button}
            onPress = {handleButtonPress}
        >
            <View>
                <Text
                    style={styles.buttonText}
                >
                Controlar
                </Text>
            </View>
        </TouchableOpacity>
        </View>
    )

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

    input: {
        height: 45,
        width: 250,
        marginTop: 120,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20
    },

    button: {
        backgroundColor: 'orange',
        height: 80,
        width: 80,
        marginTop: 180,
        marginBottom: 40,
        borderWidth: 1,
        padding: 10,
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

export default React.memo(Control);