import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, Button, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';

export const GetCurrentLocation = async() => {

    state = {
        location: null
    };

    findCoords = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const location = JSON.stringify(position);

                this.setState({ location })
            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

	render (
		<View style={styles.container}>
			<TouchableOpacity onPress={this.findCoordinates}>
				<Text style={styles.welcome}>Find My Coords?</Text>
				<Text>Location: {this.state.location}</Text>
			</TouchableOpacity>
		</View>
	);
    
/*  
    const response = { status: false, location: null }
    const resultPermissions = await Permissions.askAsync(Permissions.LOCATION)

    if (resultPermissions.status === 'denied') {
        Alert.alert("Debe otorgar permisos de ubicación.");
        return response;
    }

    const position = await Location.getCurrentPositionAsync({});
    const location = {
        'latitude': position.coords.latitude,
        'longitude': position.coords.longitude,
    }

    response.status = true;
    response.location = location;

    return response;
*/
}

const styles = StyleSheet.create({

	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF'
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	}

});