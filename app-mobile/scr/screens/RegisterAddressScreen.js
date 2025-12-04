// src/screens/RegisterAddressScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../contexts/LocationContext';
import { COLORS } from '../utils/constants';

const RegisterAddressScreen = ({ navigation, route }) => {
  const { dadosPessoais } = route.params;
  const { getCoordsFromCEP } = useLocation();

  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [coords, setCoords] = useState(null);

  // Formatar CEP
  const formatCep = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 5) {
      formatted = cleaned.substring(0, 5) + '-' + cleaned.substring(5, 8);
    }
    
    setCep(formatted);

    // Buscar CEP quando completar
    if (cleaned.length === 8) {
      buscarCep(cleaned);
    }
  };

  // Buscar CEP
  const buscarCep = async (cepLimpo) => {
    setLoadingCep(true);
    
    const result = await getCoordsFromCEP(cepLimpo);
    
    if (result.success) {
      setRua(result.endereco.rua || '');
      setBairro(result.endereco.bairro || '');
      setCidade(result.endereco.cidade || '');
      setEstado(result.endereco.estado || '');
      
      if (result.coords) {
        setCoords(result.coords);
      }
    } else {
      Alert.alert('Erro', 'CEP não encontrado');
    }
    
    setLoadingCep(false);
  };

  const handleContinue = () => {
    // Validações
    if (!cep || cep.replace(/\D/g, '').length < 8) {
      Alert.alert('Atenção', 'Digite um CEP válido');
      return;
    }

    if (!rua.trim()) {
      Alert.alert('Atenção', 'Digite o nome da rua');
      return;
    }

    if (!numero.trim()) {
      Alert.alert('Atenção', 'Digite o número');
      return;
    }

    if (!bairro.trim()) {
      Alert.alert('Atenção', 'Digite o bairro');
      return;
    }

    if (!cidade.trim()) {
      Alert.alert('Atenção', 'Digite a cidade');
      return;
    }

    if (!estado.trim()) {
      Alert.alert('Atenção', 'Digite o estado');
      return;
    }

    // Passar para próxima tela
    navigation.navigate('RegisterSegments', {
      dadosPessoais,
      endereco: {
        cep: cep.replace(/\D/g, ''),
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        coords,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Seu Endereço</Text>
          <Text style={styles.subtitle}>Passo 2 de 3 - Para encontrar lojas próximas</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: '66%' }]} />
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="location" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Seu endereço nos ajuda a encontrar as melhores lojas e consultores perto de você!
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* CEP */}
          <Text style={styles.label}>CEP *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="map-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="00000-000"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              value={cep}
              onChangeText={formatCep}
              maxLength={9}
            />
            {loadingCep && <ActivityIndicator size="small" color={COLORS.primary} />}
          </View>

          {/* Rua */}
          <Text style={styles.label}>Rua *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { marginLeft: 0 }]}
              placeholder="Nome da rua"
              placeholderTextColor={COLORS.textMuted}
              value={rua}
              onChangeText={setRua}
            />
          </View>

          {/* Número e Complemento */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Número *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { marginLeft: 0 }]}
                  placeholder="Nº"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="number-pad"
                  value={numero}
                  onChangeText={setNumero}
                />
              </View>
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Complemento</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { marginLeft: 0 }]}
                  placeholder="Apto, Bloco..."
                  placeholderTextColor={COLORS.textMuted}
                  value={complemento}
                  onChangeText={setComplemento}
                />
              </View>
            </View>
          </View>

          {/* Bairro */}
          <Text style={styles.label}>Bairro *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { marginLeft: 0 }]}
              placeholder="Seu bairro"
              placeholderTextColor={COLORS.textMuted}
              value={bairro}
              onChangeText={setBairro}
            />
          </View>

          {/* Cidade e Estado */}
          <View style={styles.row}>
            <View style={[styles.halfInput, { flex: 2 }]}>
              <Text style={styles.label}>Cidade *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { marginLeft: 0 }]}
                  placeholder="Cidade"
                  placeholderTextColor={COLORS.textMuted}
                  value={cidade}
                  onChangeText={setCidade}
                />
              </View>
            </View>

            <View style={[styles.halfInput, { flex: 1 }]}>
              <Text style={styles.label}>Estado *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { marginLeft: 0 }]}
                  placeholder="UF"
                  placeholderTextColor={COLORS.textMuted}
                  autoCapitalize="characters"
                  maxLength={2}
                  value={estado}
                  onChangeText={setEstado}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Botão Continuar */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 15,
  },
  progressContainer: {
    height: 4,
    backgroundColor: COLORS.grayMedium,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.primary,
    lineHeight: 20,
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default RegisterAddressScreen;