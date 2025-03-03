import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import HomeScreen from "./screens/Inicio/HomeScreen";
import CargaPatentesSqlite from './components/cargaPatentes/CargaPatenteSqlite';
import PagosDiarios from './screens/PagosDiarios/PagosDiarios';
import EnvioDatos from './screens/EnviarDatos/EnvioDatos';
import InfraccionesScreen from './screens/Infractores/InfraccionesScreen';
import { MaterialIcons } from '@expo/vector-icons';

import NetworkStatus from "./screens/EnviarDatos/NetworkStatus"
import CamaraComponent from "./screens/Camara/CamaraComponent";


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
                component={MyStack}
                options={{
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: () => (
                        <AntDesign name="home" size={28} color="black" />
                    )
                }}
            />
            <Tab.Screen
                name="Pagos"
                component={PagosDiarios}
                options={{
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: () => (
                        <FontAwesome5 name="car" size={24} color="black" />
                    )
                }}
            />

            <Tab.Screen
                name="cargaItem"
                component={CargaPatentesSqlite}
                options={{
                    headerShown: false,
                    title: 'Registro',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: () => (
                        <Feather name="user-check" size={24} color="black" />
                    )
                }}
            />

            <Tab.Screen
                name="Cámara"
                component={CamaraComponent}
                options={{
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: () => (
                        <FontAwesome5 name="camera" size={24} color="black" />
                    )
                }}
            />
            <Tab.Screen
                name="Enviar datos"
                component={EnvioDatos}
                options={{
                    headerShown: false,
                    title: 'Enviar Datos',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: () => (
                        <Ionicons name="cloud-upload-outline" size={24} color="black" />
                    )
                }}
            />
            <Tab.Screen
                name="Infractores"
                component={InfraccionesScreen}
                options={{
                    headerShown: false,
                    title: 'infractores',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: () => (
                        <MaterialIcons name="taxi-alert" size={24} color="black" />
                    )
                }}
            />
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