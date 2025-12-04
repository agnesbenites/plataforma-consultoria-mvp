// src/navigation/AppNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../utils/constants';

// Telas de Auth
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RegisterAddressScreen from '../screens/RegisterAddressScreen';
import RegisterSegmentsScreen from '../screens/RegisterSegmentsScreen';

// Telas principais (Tabs)
import HomeScreen from '../screens/HomeScreen';

// Telas placeholder (temporárias)
import {
  SearchScreen,
  CartScreen,
  HistoryScreen,
  ProfileScreen,
  StoreScreen,
  ProductScreen,
  ChatScreen,
  QRScannerScreen,
  RatingScreen,
  NotificationsScreen,
  EditProfileScreen,
  EditSegmentsScreen,
  SearchResultsScreen,
  ConsultorListScreen,
} from '../screens/placeholders';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator (navegação principal após login)
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Buscar') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Carrinho') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Histórico') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen 
        name="Carrinho" 
        component={CartScreen}
        options={{
          tabBarBadge: 3, // TODO: Conectar com o contexto do carrinho
          tabBarBadgeStyle: {
            backgroundColor: COLORS.danger,
            fontSize: 10,
          },
        }}
      />
      <Tab.Screen name="Histórico" component={HistoryScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Auth Stack (telas de autenticação)
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="RegisterAddress" component={RegisterAddressScreen} />
      <Stack.Screen name="RegisterSegments" component={RegisterSegmentsScreen} />
    </Stack.Navigator>
  );
};

// Main Stack (telas principais após login)
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Store" 
        component={StoreScreen}
        options={({ route }) => ({ 
          title: route.params?.storeName || 'Loja',
        })}
      />
      <Stack.Screen 
        name="Product" 
        component={ProductScreen}
        options={({ route }) => ({ 
          title: route.params?.productName || 'Produto',
        })}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }) => ({ 
          title: route.params?.consultorName || 'Chat',
        })}
      />
      <Stack.Screen 
        name="QRScanner" 
        component={QRScannerScreen}
        options={{ 
          title: 'Escanear QR Code',
          headerTransparent: true,
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen 
        name="Rating" 
        component={RatingScreen}
        options={{ 
          title: 'Avaliar Atendimento',
          headerBackVisible: false, // Não permite voltar sem avaliar
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ title: 'Notificações' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
      <Stack.Screen 
        name="EditSegments" 
        component={EditSegmentsScreen}
        options={{ title: 'Meus Segmentos' }}
      />
      <Stack.Screen 
        name="SearchResults" 
        component={SearchResultsScreen}
        options={({ route }) => ({ 
          title: route.params?.searchTerm || 'Resultados',
        })}
      />
      <Stack.Screen 
        name="ConsultorList" 
        component={ConsultorListScreen}
        options={({ route }) => ({ 
          title: route.params?.storeName ? `Consultores - ${route.params.storeName}` : 'Consultores',
        })}
      />
    </Stack.Navigator>
  );
};

// App Navigator principal
const AppNavigator = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {signed ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;