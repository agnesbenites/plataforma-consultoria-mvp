// src/screens/HomeScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { buscarLojasProximas, obterPromocoes } from '../services/api';
import { COLORS, SEGMENTOS } from '../utils/constants';

const HomeScreen = ({ navigation }) => {
  const { user, isAdult } = useAuth();
  const { location, address } = useLocation();
  
  const [searchText, setSearchText] = useState('');
  const [lojasProximas, setLojasProximas] = useState([]);
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, [location]);

  const carregarDados = async () => {
    if (!location) return;
    
    setLoading(true);
    
    try {
      // Buscar lojas próximas
      const lojasResult = await buscarLojasProximas(
        location.latitude,
        location.longitude,
        10,
        user?.segmentos || []
      );
      
      if (lojasResult.success) {
        setLojasProximas(lojasResult.lojas || []);
      }

      // Buscar promoções
      const promosResult = await obterPromocoes(
        location.latitude,
        location.longitude,
        user?.segmentos || []
      );
      
      if (promosResult.success) {
        setPromocoes(promosResult.promocoes || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      navigation.navigate('SearchResults', { searchTerm: searchText });
    }
  };

  // Segmentos do usuário
  const meusSegmentos = SEGMENTOS.filter(seg => 
    user?.segmentos?.includes(seg.id) && (!seg.adulto || isAdult)
  );

  // Mock de lojas próximas para exibição
  const mockLojas = [
    { id: 1, nome: 'Magazine Tech', distancia: '1.2 km', avaliacao: 4.8, segmento: 'Eletrônicos', imagem: null },
    { id: 2, nome: 'Moda Fashion', distancia: '2.5 km', avaliacao: 4.5, segmento: 'Roupas', imagem: null },
    { id: 3, nome: 'Casa & Cia', distancia: '3.0 km', avaliacao: 4.7, segmento: 'Móveis', imagem: null },
  ];

  // Mock de promoções
  const mockPromocoes = [
    { id: 1, titulo: 'Black Friday Antecipada', loja: 'Magazine Tech', desconto: '50%', cor: '#e74c3c' },
    { id: 2, titulo: 'Queima de Estoque', loja: 'Moda Fashion', desconto: '30%', cor: '#9b59b6' },
  ];

  const LojaCard = ({ loja }) => (
    <TouchableOpacity 
      style={styles.lojaCard}
      onPress={() => navigation.navigate('Store', { storeId: loja.id, storeName: loja.nome })}
    >
      <View style={styles.lojaImagem}>
        <Text style={styles.lojaEmojiPlaceholder}>🏪</Text>
      </View>
      <View style={styles.lojaInfo}>
        <Text style={styles.lojaNome}>{loja.nome}</Text>
        <Text style={styles.lojaSegmento}>{loja.segmento}</Text>
        <View style={styles.lojaFooter}>
          <View style={styles.lojaAvaliacao}>
            <Ionicons name="star" size={14} color="#f1c40f" />
            <Text style={styles.lojaAvaliacaoText}>{loja.avaliacao}</Text>
          </View>
          <Text style={styles.lojaDistancia}>📍 {loja.distancia}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const PromoCard = ({ promo }) => (
    <TouchableOpacity style={[styles.promoCard, { backgroundColor: promo.cor }]}>
      <Text style={styles.promoDesconto}>{promo.desconto} OFF</Text>
      <Text style={styles.promoTitulo}>{promo.titulo}</Text>
      <Text style={styles.promoLoja}>{promo.loja}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.nome?.split(' ')[0] || 'Cliente'}! 👋</Text>
            <TouchableOpacity style={styles.locationRow}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {address?.bairro || address?.cidade || 'Localização'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produto, loja ou segmento..."
            placeholderTextColor={COLORS.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            style={styles.qrButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Ionicons name="qr-code" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Meus Segmentos */}
        {meusSegmentos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meus Interesses</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EditSegments')}>
                <Text style={styles.sectionLink}>Editar</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {meusSegmentos.map(seg => (
                <TouchableOpacity 
                  key={seg.id} 
                  style={styles.segmentChip}
                  onPress={() => navigation.navigate('SearchResults', { 
                    searchTerm: seg.nome,
                    segmentId: seg.id 
                  })}
                >
                  <Text style={styles.segmentEmoji}>{seg.emoji}</Text>
                  <Text style={styles.segmentName}>{seg.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Promoções */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Promoções</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockPromocoes.map(promo => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </ScrollView>
        </View>

        {/* Lojas Próximas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📍 Lojas Próximas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Buscar')}>
              <Text style={styles.sectionLink}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          {mockLojas.map(loja => (
            <LojaCard key={loja.id} loja={loja} />
          ))}
        </View>

        {/* Espaço extra no final */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 4,
    marginRight: 2,
    maxWidth: 200,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 10,
  },
  qrButton: {
    padding: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sectionLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  segmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  segmentName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  promoCard: {
    width: 200,
    padding: 20,
    borderRadius: 15,
    marginRight: 12,
  },
  promoDesconto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  promoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 5,
  },
  promoLoja: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
  },
  lojaCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  lojaImagem: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lojaEmojiPlaceholder: {
    fontSize: 30,
  },
  lojaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  lojaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  lojaSegmento: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  lojaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lojaAvaliacao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  lojaAvaliacaoText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  lojaDistancia: {
    fontSize: 13,
    color: COLORS.textLight,
  },
});

export default HomeScreen;