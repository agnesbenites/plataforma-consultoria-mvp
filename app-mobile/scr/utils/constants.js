// src/utils/constants.js

// API Configuration
export const API_URL = 'https://plataforma-consultoria-mvp.onrender.com/api';
export const SOCKET_URL = 'https://plataforma-consultoria-mvp.onrender.com';

// Cores do App
export const COLORS = {
  primary: '#2c5aa0',
  primaryDark: '#1e3d6f',
  primaryLight: '#eaf2ff',
  secondary: '#28a745',
  secondaryLight: '#e8f5e9',
  accent: '#ffc107',
  danger: '#dc3545',
  dangerLight: '#f8d7da',
  gray: '#6c757d',
  grayLight: '#f8f9fa',
  grayMedium: '#e9ecef',
  white: '#ffffff',
  black: '#333333',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  border: '#dee2e6',
  background: '#f8f9fa',
};

// Segmentos disponíveis
export const SEGMENTOS = [
  { id: 1, nome: 'Roupas Femininas', icon: '👗', emoji: '👗' },
  { id: 2, nome: 'Roupas Masculinas', icon: '👔', emoji: '👔' },
  { id: 3, nome: 'Calçados', icon: '👟', emoji: '👟' },
  { id: 4, nome: 'Acessórios', icon: '👜', emoji: '👜' },
  { id: 5, nome: 'Eletrônicos', icon: '📱', emoji: '📱' },
  { id: 6, nome: 'Eletrodomésticos', icon: '🔌', emoji: '🔌' },
  { id: 7, nome: 'Móveis', icon: '🛋️', emoji: '🛋️' },
  { id: 8, nome: 'Decoração', icon: '🖼️', emoji: '🖼️' },
  { id: 9, nome: 'Brinquedos', icon: '🧸', emoji: '🧸' },
  { id: 10, nome: 'Esportes', icon: '⚽', emoji: '⚽' },
  { id: 11, nome: 'Beleza', icon: '💄', emoji: '💄' },
  { id: 12, nome: 'Saúde', icon: '💊', emoji: '💊' },
  { id: 13, nome: 'Alimentos', icon: '🍎', emoji: '🍎' },
  { id: 14, nome: 'Bebidas', icon: '🍷', emoji: '🍷', adulto: true },
  { id: 15, nome: 'Pet Shop', icon: '🐕', emoji: '🐕' },
  { id: 16, nome: 'Papelaria', icon: '📚', emoji: '📚' },
  { id: 17, nome: 'Joias', icon: '💎', emoji: '💎' },
  { id: 18, nome: 'Ótica', icon: '👓', emoji: '👓' },
  { id: 19, nome: 'Tabacaria', icon: '🚬', emoji: '🚬', adulto: true },
  { id: 20, nome: 'Presentes', icon: '🎁', emoji: '🎁' },
];

// Idade mínima para conteúdo adulto
export const IDADE_MINIMA_ADULTO = 18;

// Configurações de busca
export const BUSCA_CONFIG = {
  raioKmPadrao: 10, // 10km de raio padrão
  raioKmMaximo: 50, // 50km de raio máximo
  limitePorPagina: 20,
};

// Status de atendimento
export const STATUS_ATENDIMENTO = {
  AGUARDANDO: 'aguardando',
  EM_ANDAMENTO: 'em_andamento',
  FINALIZADO: 'finalizado',
  CANCELADO: 'cancelado',
};

// Tipos de mensagem no chat
export const TIPO_MENSAGEM = {
  TEXTO: 'texto',
  IMAGEM: 'imagem',
  AUDIO: 'audio',
  VIDEO: 'video',
  PRODUTO: 'produto',
  SISTEMA: 'sistema',
};

// Mensagens de permissão
export const PERMISSION_MESSAGES = {
  location: {
    title: '📍 Localização',
    message: 'Precisamos da sua localização para encontrar lojas próximas a você.',
    required: true,
  },
  camera: {
    title: '📷 Câmera',
    message: 'Precisamos da câmera para escanear QR Codes das lojas e enviar fotos no chat.',
    required: true,
  },
  microphone: {
    title: '🎤 Microfone',
    message: 'Precisamos do microfone para você enviar mensagens de áudio.',
    required: false,
  },
  photos: {
    title: '🖼️ Galeria de Fotos',
    message: 'Precisamos acessar suas fotos para você enviar imagens no chat.',
    required: false,
  },
  notifications: {
    title: '🔔 Notificações',
    message: 'Ative para receber promoções e atualizações de lojas que você gosta.',
    required: false,
  },
};