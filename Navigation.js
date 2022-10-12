import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from "./screens/HomeScreen";
import CargaPatentesScreen from "./screens/CargaPatentesScreen";
import PagoPatenteScreen from "./screens/PagoPatenteScreen";

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
                name="Pago en efectivo" 
                component={PagoPatenteScreen} 
                options= {{
                    headerShown: false,
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