import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ToastAndroid, Button, Platform,ImageBackground } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import LoginScreen from './HandleLogin';

const InfraccionesScreen = () => {
    const [infracciones, setInfracciones] = useState([]);
    const [obleistaSummaries, setObleistaSummaries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [view, setView] = useState('infracciones');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const obtenerInfracciones = async () => {
            setIsLoading(true);

            try {
                const response = await fetch('http://if012app.fi.mdn.unp.edu.ar:28001/infraccion/all');
                if (response.ok) {
                    const data = await response.json();


                    setInfracciones(data.map(infraccion => ({
                        ...infraccion,
                        fechaFormateada: formatFecha(infraccion.fecha),
                        horaFormateada: formatHora(infraccion.hora) })));

                } else {
                    console.error('Error al obtener las infracciones:', response.status);
                    ToastAndroid.show(`Error al obtener las infracciones: ${response.status}`, ToastAndroid.LONG);
                }
            } catch (error) {
                console.error('Error de red:', error);
                ToastAndroid.show(`Error de red: ${error.message}`, ToastAndroid.LONG);
            } finally {
                setIsLoading(false);
            }
        };

        const obtenerObleistaSummaries = async () => {
            setIsLoading(true);

            try {
                const response = await fetch('http://if012app.fi.mdn.unp.edu.ar:28001/infraccion/obleista-summaries');
                if (response.ok) {
                    const data = await response.json();
                    setObleistaSummaries(data);
                } else {
                    console.error('Error al obtener los resúmenes de obleistas:', response.status);
                    ToastAndroid.show(`Error al obtener los resúmenes de obleistas: ${response.status}`, ToastAndroid.LONG);
                }
            } catch (error) {
                console.error('Error de red:', error);
                ToastAndroid.show(`Error de red: ${error.message}`, ToastAndroid.LONG);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoggedIn) {
            if (view === 'infracciones') {
                obtenerInfracciones();
            } else if (view === 'obleistaSummaries') {
                obtenerObleistaSummaries();
            }
        }
    }, [isLoggedIn, view]);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);

        if (event.type === 'set') {
            fetchInfraccionesByDate(currentDate);
        }
    };

    const fetchInfraccionesByDate = async (selectedDate) => {
        setIsLoading(true);

        try {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Formatea la fecha a YYYY-MM-DD
            const response = await fetch(`http://if012app.fi.mdn.unp.edu.ar:28001/infraccion/byFecha/${formattedDate}`);
            if (response.ok) {
                const data = await response.json();
                setInfracciones(data.map(infraccion => ({
                    ...infraccion,
                    fechaFormateada: formatFecha(infraccion.fecha),
                    horaFormateada: formatHora(infraccion.hora)
                })));
            } else {
                console.error('Error al obtener las infracciones por fecha:', response.status);
                ToastAndroid.show(`Error al obtener las infracciones por fecha: ${response.status}`, ToastAndroid.LONG);
            }
        } catch (error) {
            console.error('Error de red:', error);
            ToastAndroid.show(`Error de red: ${error.message}`, ToastAndroid.LONG);
        } finally {
            setIsLoading(false);
        }
    };

    const formatFecha = (fechaISO) => {
        const date = new Date(fechaISO);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const formatHora = (horaISO) => {
        const date = new Date(horaISO);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    if (!isLoggedIn) {
        return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <ImageBackground
            source={require('../../assets/background.jpg')} // Ruta de tu imagen de fondo
            style={styles.background}
            resizeMode="cover" // Opciones: cover, contain, stretch, repeat, center
        >
            <View style={styles.container}>
                <Text style={styles.title}>Panel de Administrador</Text>

                {/* Botones de navegación */}
                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <Button title="Mostrar todas las Infracciones" onPress={() => setView('infracciones')} />
                    </View>
                    <View style={styles.button}>
                        <Button title="Mostrar Suma de Totales" onPress={() => setView('obleistaSummaries')} />
                    </View>
                    <View style={styles.button}>
                        <Button title="Infracciones por Fecha" onPress={() => setShowDatePicker(true)} />
                    </View>
                </View>

                {/* Selector de fecha */}
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                {/* Lista de datos */}
                {isLoading ? (
                    <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
                ) : (
                    <>
                        {view === 'infracciones' ? (
                            <FlatList
                                data={infracciones}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.item}>
                                        <Text style={styles.itemText}>Patente: {item.patente}</Text>
                                        <Text style={styles.itemText}>Fecha: {item.fechaFormateada}</Text>
                                        <Text style={styles.itemText}>Hora: {item.horaFormateada}</Text>
                                    </View>
                                )}
                                ListEmptyComponent={<Text style={styles.emptyMessage}>No se encontraron infracciones</Text>}
                            />
                        ) : (
                            <FlatList
                                data={obleistaSummaries}
                                keyExtractor={(item) => item.obleistaId.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.item}>
                                        <Text style={styles.itemText}>Obleista: {item.obleistaNombre}</Text>
                                        <Text style={styles.itemText}>Total Recaudado: {item.totalValor}</Text>
                                        <Text style={styles.itemText}>Total Registrados: {item.totalRegistros}</Text>
                                    </View>
                                )}
                                ListEmptyComponent={<Text style={styles.emptyMessage}>No se encontraron resúmenes de obleistas</Text>}
                            />
                        )}
                    </>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,

        padding: 16,
    },
    background: {
        flex: 1,
        resizeMode: 'cover', // 'cover' o 'contain' según tu preferencia
        justifyContent: 'center', // Ajusta la imagen según sea necesario
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'column',  // Cambiado a columna para que los botones se apilen verticalmente
        justifyContent: 'space-around',
        alignItems: 'center',  // Centrar los botones horizontalmente
        marginBottom: 16,
    },
    button: {
        width: '80%',  // Ancho del contenedor de botón ajustado para evitar solapamientos
        marginBottom: 12,  // Espaciado inferior entre botones
    },
    loader: {
        marginTop: 20,
    },
    item: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 8,
        borderRadius: 8,
        elevation: 2, // Sombras para mejorar la apariencia en Android
    },
    itemText: {
        fontSize: 16,
        marginBottom: 4,
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
});

export default InfraccionesScreen;