// mobile/src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Criar Conta' }} />

      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início (Consultoria)' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Atendimento' }} />

    </Stack.Navigator>
  );
};

export default AppNavigator;