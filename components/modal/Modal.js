import React from 'react';
import { StyleSheet } from 'react-native';

export default function Modal({ isVisible, setVisible, children }) {

    return (
        <Overlay
            isVisible={isVisible}
            overlayStyle={styles.overlay}
            onBackdropPress={() => setVisible(false)}
        >
            {
                children
            }
        </Overlay>
    )

}

const styles = StyleSheet.create({

    overlay: {
        width: '90%'
    }

})