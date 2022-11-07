import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from "./screens/HomeScreen";
import CargaPatentesScreen from "./screens/CargaPatentesScreen";
import CargaPatentesSqlite from './components/cargaPatentesComponents/CargaPatenteSqlite';
import PagosDiarios from './components/cargaPatentesComponents/PagosDiarios';
import Ubicacion from './screens/Geolocalizacion';
import CameraScrenn from './screens/cameraScrenn/CameraScrenn';


import CameraScreen from './components/cameraComponents/CameraScreen';


const HomeStackNavigator = createNativeStackNavigator();


function MyStack() {
    return(
        <HomeStackNavigator.Navigator
            initialRouteName="Home"
        >

            <HomeStackNavigator.Screen
                name="Inicio"
                component={HomeScreen}
            />

            <HomeStackNavigator.Screen
                name="CameraScreen"
                component={CameraScreen}
            />

        </HomeStackNavigator.Navigator>
    )
}

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: 'orange'
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    title: 'Inicio',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="home"
                            color={color}
                            size={size}
                        />
                    )
                }}
            />
            <Tab.Screen
                name="Carga de patentes"
                component={CargaPatentesScreen}
                options={{
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="car"
                            color={color}
                            size={size}
                        />
                    )
                }}
            />

            <Tab.Screen
                name="cargaItem"
                component={CargaPatentesSqlite}
                options={{
                    headerShown: false,
                    title: 'items',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="playlist-edit"
                            color={color}
                            size={size}
                        />
                    )
                }}
            />

            <Tab.Screen
                name="pagos diarios"
                component={PagosDiarios}
                options={{
                    headerShown: false,
                    title: 'pagos diarios',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="cash"
                            color={color}
                            size={size}
                        />
                    )
                }}
            />
            <Tab.Screen
                name=" camara"
                component={CameraScrenn}
                options={{
                    headerShown: false,
                    title: 'camera',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="cash"
                            color={color}
                            size={size}
                        />
                    )
                }}
            /> 
            

          {/*   <Tab.Screen
                name=" Ubicacion"
                component={Ubicacion}
                options={{
                    headerShown: false,
                    title: 'ubicacion',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="cash"
                            color={color}
                            size={size}
                        />
                    )
                }}
            /> */}

        </Tab.Navigator>





    )
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    )
}