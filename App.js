import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import Icon from 'react-native-ico-material-design';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './Navigation';

export default class App extends React.Component { 

  render () {
    return (
      <Navigation />
    );
  }

}