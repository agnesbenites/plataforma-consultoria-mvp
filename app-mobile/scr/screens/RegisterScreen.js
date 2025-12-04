// src/screens/RegisterScreen.js

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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

const RegisterScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Formatar telefone
  const formatTelefone = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 0) {
      formatted = '(' + cleaned;
    }
    if (cleaned.length > 2) {
      formatted = '(' + cleaned.substring(0, 2) + ') ' + cleaned.substring(2);
    }
    if (cleaned.length > 7) {
      formatted = '(' + cleaned.substring(0, 2) + ') ' + cleaned.substring(2, 7) + '-' + cleaned.substring(7, 11);
    }
    
    setTelefone(formatted);
  };

  // Formatar data de nascimento
  const formatDataNascimento = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length > 4) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4) + '/' + cleaned.substring(4, 8);
    }
    
    setDataNascimento(formatted);
  };

  // Validar idade
  const calcularIdade = (dataNasc) => {
    const partes = dataNasc.split('/');
    if (partes.length !== 3) return 0;
    
    const nascimento = new Date(partes[2], partes[1] - 1, partes[0]);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  };

  const handleContinue = () => {
    // Validações
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite seu nome completo');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Atenção', 'Digite um e-mail válido');
      return;
    }

    if (telefone.replace(/\D/g, '').length < 10) {
      Alert.alert('Atenção', 'Digite um telefone válido');
      return;
    }

    if (dataNascimento.length < 10) {
      Alert.alert('Atenção', 'Digite sua data de nascimento completa');
      return;
    }

    const idade = calcularIdade(dataNascimento);
    if (idade < 13) {
      Alert.alert('Atenção', 'Você precisa ter pelo menos 13 anos para usar o app');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem');
      return;
    }

    // Passar para próxima tela com os dados
    navigation.navigate('RegisterAddress', {
      dadosPessoais: {
        nome,
        email,
        telefone: telefone.replace(/\D/g, ''),
        dataNascimento,
        senha,
        maiorDeIdade: idade >= 18,
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
          
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Passo 1 de 3 - Dados Pessoais</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: '33%' }]} />
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Nome */}
          <Text style={styles.label}>Nome Completo *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              placeholderTextColor={COLORS.textMuted}
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>E-mail *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Telefone */}
          <Text style={styles.label}>Telefone *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={formatTelefone}
              maxLength={15}
            />
          </View>

          {/* Data de Nascimento */}
          <Text style={styles.label}>Data de Nascimento *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              value={dataNascimento}
              onChangeText={formatDataNascimento}
              maxLength={10}
            />
          </View>
          <Text style={styles.helperText}>
            🔞 Sua idade define se você pode ver produtos +18
          </Text>

          {/* Senha */}
          <Text style={styles.label}>Senha *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          {/* Confirmar Senha */}
          <Text style={styles.label}>Confirmar Senha *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Repita a senha"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
          </View>
        </View>

        {/* Botão Continuar */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>

        {/* Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 30,
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
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 5,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;