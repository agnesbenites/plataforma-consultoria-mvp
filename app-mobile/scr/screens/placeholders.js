// src/screens/placeholders.js
// Telas placeholder para completar a navegação inicial

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

const PlaceholderScreen = ({ title, emoji }) => (
  <View style={styles.container}>
    <Text style={styles.emoji}>{emoji}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>Em desenvolvimento...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

// Exportar todas as telas placeholder
export const SearchScreen = () => <PlaceholderScreen emoji="🔍" title="Buscar" />;
export const CartScreen = () => <PlaceholderScreen emoji="🛒" title="Carrinho" />;
export const HistoryScreen = () => <PlaceholderScreen emoji="📋" title="Histórico" />;
export const ProfileScreen = () => <PlaceholderScreen emoji="👤" title="Perfil" />;
export const StoreScreen = () => <PlaceholderScreen emoji="🏪" title="Loja" />;
export const ProductScreen = () => <PlaceholderScreen emoji="📦" title="Produto" />;
export const ChatScreen = () => <PlaceholderScreen emoji="💬" title="Chat" />;
export const QRScannerScreen = () => <PlaceholderScreen emoji="📷" title="Scanner QR" />;
export const RatingScreen = () => <PlaceholderScreen emoji="⭐" title="Avaliação" />;
export const NotificationsScreen = () => <PlaceholderScreen emoji="🔔" title="Notificações" />;
export const EditProfileScreen = () => <PlaceholderScreen emoji="✏️" title="Editar Perfil" />;
export const EditSegmentsScreen = () => <PlaceholderScreen emoji="🏷️" title="Meus Segmentos" />;
export const SearchResultsScreen = () => <PlaceholderScreen emoji="📋" title="Resultados" />;
export const ConsultorListScreen = () => <PlaceholderScreen emoji="👨‍💼" title="Consultores" />;