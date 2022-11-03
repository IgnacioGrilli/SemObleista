import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from "./screens/HomeScreen";
import CargaPatentesScreen from "./screens/CargaPatentesScreen";
import CargaPatentesSqlite from './components/cargaPatentesComponents/CargaPatenteSqlite';

import CameraScreen from './components/cameraComponents/CameraScreen';

const Tab = createBottomTabNavigator();

function MyTabs() {
    return(
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions= {{
                tabBarActiveTintColor: 'orange'
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options= {{
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
                options= {{
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
                options= {{
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
                name="Camara" 
                component={CameraScreen} 
                options= {{
                    headerShown: false, 
                    title: 'Camara',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        marginBottom: 8,
                        marginTop: -8
                    },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons 
                            name="camera" 
                            color={color} 
                            size={size}
                        />
                    )
                }}
            />

        </Tab.Navigator>
        
    )
}

export default function Navigation() {
    return(
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    )
}