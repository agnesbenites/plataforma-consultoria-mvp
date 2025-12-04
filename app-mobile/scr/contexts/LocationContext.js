// src/contexts/LocationContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationContext = createContext({});

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Solicitar permissão de localização
  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        setPermissionGranted(true);
        await AsyncStorage.setItem('@CompraSmartCliente:locationPermission', 'granted');
        await getCurrentLocation();
        return true;
      } else {
        setPermissionGranted(false);
        setErrorMsg('Permissão de localização negada');
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      setErrorMsg('Erro ao solicitar permissão de localização');
      return false;
    }
  };

  // Verificar status da permissão
  const checkPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionGranted(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return false;
    }
  };

  // Obter localização atual
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const hasPermission = await checkPermission();
      if (!hasPermission) {
        setLoading(false);
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(coords);
      await AsyncStorage.setItem('@CompraSmartCliente:lastLocation', JSON.stringify(coords));

      // Obter endereço a partir das coordenadas
      await getAddressFromCoords(coords.latitude, coords.longitude);

      setLoading(false);
      return coords;
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setErrorMsg('Erro ao obter localização');
      setLoading(false);
      return null;
    }
  };

  // Obter endereço a partir das coordenadas
  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const [result] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result) {
        const addressData = {
          rua: result.street,
          numero: result.streetNumber,
          bairro: result.district || result.subregion,
          cidade: result.city,
          estado: result.region,
          cep: result.postalCode,
          pais: result.country,
          completo: `${result.street || ''}, ${result.streetNumber || ''} - ${result.district || result.subregion || ''}, ${result.city || ''} - ${result.region || ''}`,
        };
        setAddress(addressData);
        return addressData;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      return null;
    }
  };

  // Obter coordenadas a partir do CEP
  const getCoordsFromCEP = async (cep) => {
    try {
      // Remove caracteres não numéricos
      const cepLimpo = cep.replace(/\D/g, '');
      
      // Busca endereço pelo ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        return { success: false, error: 'CEP não encontrado' };
      }

      // Geocoding do endereço
      const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brasil`;
      const geoResults = await Location.geocodeAsync(enderecoCompleto);

      if (geoResults.length > 0) {
        const coords = {
          latitude: geoResults[0].latitude,
          longitude: geoResults[0].longitude,
        };

        return {
          success: true,
          coords,
          endereco: {
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
            cep: cepLimpo,
          },
        };
      }

      return {
        success: true,
        coords: null,
        endereco: {
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
          cep: cepLimpo,
        },
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return { success: false, error: 'Erro ao buscar CEP' };
    }
  };

  // Calcular distância entre dois pontos (em km)
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Carregar última localização conhecida
  useEffect(() => {
    const loadLastLocation = async () => {
      try {
        const stored = await AsyncStorage.getItem('@CompraSmartCliente:lastLocation');
        if (stored) {
          setLocation(JSON.parse(stored));
        }
        
        const hasPermission = await checkPermission();
        if (hasPermission) {
          getCurrentLocation();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao carregar localização:', error);
        setLoading(false);
      }
    };

    loadLastLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        address,
        loading,
        permissionGranted,
        errorMsg,
        requestPermission,
        checkPermission,
        getCurrentLocation,
        getAddressFromCoords,
        getCoordsFromCEP,
        calcularDistancia,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation deve ser usado dentro de um LocationProvider');
  }
  return context;
};

export default LocationContext;