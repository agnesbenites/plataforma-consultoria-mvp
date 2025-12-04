// src/screens/RegisterSegmentsScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, SEGMENTOS } from '../utils/constants';

const RegisterSegmentsScreen = ({ navigation, route }) => {
  const { dadosPessoais, endereco } = route.params;
  const { signUp } = useAuth();

  const [selectedSegments, setSelectedSegments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtrar segmentos adultos se menor de idade
  const segmentosDisponiveis = SEGMENTOS.filter(seg => {
    if (seg.adulto && !dadosPessoais.maiorDeIdade) {
      return false;
    }
    return true;
  });

  const toggleSegment = (segmentId) => {
    if (selectedSegments.includes(segmentId)) {
      setSelectedSegments(selectedSegments.filter(id => id !== segmentId));
    } else {
      setSelectedSegments([...selectedSegments, segmentId]);
    }
  };

  const handleFinish = async () => {
    if (selectedSegments.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um segmento de interesse');
      return;
    }

    setLoading(true);

    // Montar objeto completo do cliente
    const dadosCliente = {
      nome: dadosPessoais.nome,
      email: dadosPessoais.email,
      telefone: dadosPessoais.telefone,
      dataNascimento: dadosPessoais.dataNascimento,
      senha: dadosPessoais.senha,
      endereco: {
        cep: endereco.cep,
        rua: endereco.rua,
        numero: endereco.numero,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        latitude: endereco.coords?.latitude,
        longitude: endereco.coords?.longitude,
      },
      segmentos: selectedSegments,
    };

    const result = await signUp(dadosCliente);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erro', result.error);
    }
    // Se sucesso, o AuthContext vai redirecionar automaticamente
  };

  const SegmentCard = ({ segment }) => {
    const isSelected = selectedSegments.includes(segment.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.segmentCard,
          isSelected && styles.segmentCardSelected,
        ]}
        onPress={() => toggleSegment(segment.id)}
      >
        <Text style={styles.segmentEmoji}>{segment.emoji}</Text>
        <Text style={[
          styles.segmentName,
          isSelected && styles.segmentNameSelected,
        ]}>
          {segment.nome}
        </Text>
        {segment.adulto && (
          <Text style={styles.adultBadge}>+18</Text>
        )}
        {isSelected && (
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
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
          
          <Text style={styles.title}>Seus Interesses</Text>
          <Text style={styles.subtitle}>Passo 3 de 3 - Selecione seus segmentos favoritos</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: '100%' }]} />
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="heart" size={24} color={COLORS.secondary} />
          <Text style={styles.infoText}>
            Selecione os segmentos que você mais gosta! Isso nos ajuda a encontrar lojas e produtos perfeitos para você.
          </Text>
        </View>

        {/* Contador */}
        <Text style={styles.counter}>
          {selectedSegments.length} selecionado{selectedSegments.length !== 1 ? 's' : ''}
        </Text>

        {/* Grid de Segmentos */}
        <View style={styles.segmentsGrid}>
          {segmentosDisponiveis.map(segment => (
            <SegmentCard key={segment.id} segment={segment} />
          ))}
        </View>
      </ScrollView>

      {/* Botão Finalizar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.finishButton,
            selectedSegments.length === 0 && styles.finishButtonDisabled,
          ]}
          onPress={handleFinish}
          disabled={loading || selectedSegments.length === 0}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.finishButtonText}>Criar Conta</Text>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 100,
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
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryLight,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 20,
  },
  counter: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 15,
    textAlign: 'center',
  },
  segmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  segmentCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
  },
  segmentCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  segmentEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  segmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  segmentNameSelected: {
    color: COLORS.primary,
  },
  adultBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.danger,
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  finishButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },
  finishButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default RegisterSegmentsScreen;