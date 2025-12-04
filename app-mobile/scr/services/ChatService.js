// src/services/ChatService.js

import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL, TIPO_MENSAGEM } from '../utils/constants';

class ChatService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.currentRoom = null;
    this.messageListeners = [];
    this.statusListeners = [];
  }

  // Conectar ao servidor Socket.io
  async connect() {
    try {
      const token = await AsyncStorage.getItem('@CompraSmartCliente:token');
      
      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket conectado:', this.socket.id);
        this.connected = true;
        this.notifyStatusListeners('connected');
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Socket desconectado:', reason);
        this.connected = false;
        this.notifyStatusListeners('disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Erro de conexão:', error);
        this.notifyStatusListeners('error', error.message);
      });

      // Listener de mensagens recebidas
      this.socket.on('nova_mensagem', (mensagem) => {
        console.log('📩 Nova mensagem:', mensagem);
        this.notifyMessageListeners(mensagem);
      });

      // Listener de status do consultor/vendedor
      this.socket.on('consultor_status', (status) => {
        console.log('👤 Status consultor:', status);
        this.notifyStatusListeners('consultor_status', status);
      });

      // Listener de digitação
      this.socket.on('digitando', (data) => {
        this.notifyStatusListeners('typing', data);
      });

      // Listener de atendimento aceito
      this.socket.on('atendimento_aceito', (data) => {
        console.log('✅ Atendimento aceito:', data);
        this.notifyStatusListeners('atendimento_aceito', data);
      });

      // Listener de atendimento finalizado
      this.socket.on('atendimento_finalizado', (data) => {
        console.log('🏁 Atendimento finalizado:', data);
        this.notifyStatusListeners('atendimento_finalizado', data);
      });

      return true;
    } catch (error) {
      console.error('Erro ao conectar socket:', error);
      return false;
    }
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.currentRoom = null;
    }
  }

  // Entrar em uma sala de chat (atendimento)
  joinRoom(atendimentoId) {
    if (!this.socket || !this.connected) {
      console.error('Socket não conectado');
      return false;
    }

    this.currentRoom = atendimentoId;
    this.socket.emit('entrar_sala', { atendimentoId });
    console.log('🚪 Entrando na sala:', atendimentoId);
    return true;
  }

  // Sair da sala de chat
  leaveRoom() {
    if (!this.socket || !this.currentRoom) return;

    this.socket.emit('sair_sala', { atendimentoId: this.currentRoom });
    console.log('🚪 Saindo da sala:', this.currentRoom);
    this.currentRoom = null;
  }

  // Enviar mensagem de texto
  sendTextMessage(texto) {
    if (!this.socket || !this.currentRoom) {
      console.error('Não está em uma sala de chat');
      return false;
    }

    const mensagem = {
      atendimentoId: this.currentRoom,
      tipo: TIPO_MENSAGEM.TEXTO,
      conteudo: texto,
      timestamp: new Date().toISOString(),
    };

    this.socket.emit('enviar_mensagem', mensagem);
    return true;
  }

  // Enviar mensagem com imagem
  sendImageMessage(imageUri, imageBase64) {
    if (!this.socket || !this.currentRoom) {
      console.error('Não está em uma sala de chat');
      return false;
    }

    const mensagem = {
      atendimentoId: this.currentRoom,
      tipo: TIPO_MENSAGEM.IMAGEM,
      conteudo: imageBase64,
      uri: imageUri,
      timestamp: new Date().toISOString(),
    };

    this.socket.emit('enviar_mensagem', mensagem);
    return true;
  }

  // Enviar mensagem de áudio
  sendAudioMessage(audioUri, audioBase64, duracao) {
    if (!this.socket || !this.currentRoom) {
      console.error('Não está em uma sala de chat');
      return false;
    }

    const mensagem = {
      atendimentoId: this.currentRoom,
      tipo: TIPO_MENSAGEM.AUDIO,
      conteudo: audioBase64,
      uri: audioUri,
      duracao,
      timestamp: new Date().toISOString(),
    };

    this.socket.emit('enviar_mensagem', mensagem);
    return true;
  }

  // Enviar produto selecionado
  sendProductMessage(produto) {
    if (!this.socket || !this.currentRoom) {
      console.error('Não está em uma sala de chat');
      return false;
    }

    const mensagem = {
      atendimentoId: this.currentRoom,
      tipo: TIPO_MENSAGEM.PRODUTO,
      conteudo: produto,
      timestamp: new Date().toISOString(),
    };

    this.socket.emit('enviar_mensagem', mensagem);
    return true;
  }

  // Indicar que está digitando
  sendTyping(isTyping) {
    if (!this.socket || !this.currentRoom) return;

    this.socket.emit('digitando', {
      atendimentoId: this.currentRoom,
      digitando: isTyping,
    });
  }

  // Solicitar atendimento
  solicitarAtendimento(lojaId, consultorId = null) {
    if (!this.socket) {
      console.error('Socket não conectado');
      return false;
    }

    this.socket.emit('solicitar_atendimento', {
      lojaId,
      consultorId,
    });

    return true;
  }

  // Avaliar atendimento
  avaliarAtendimento(atendimentoId, nota, comentario) {
    if (!this.socket) {
      console.error('Socket não conectado');
      return false;
    }

    this.socket.emit('avaliar_atendimento', {
      atendimentoId,
      nota,
      comentario,
    });

    return true;
  }

  // Adicionar listener de mensagens
  addMessageListener(callback) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== callback);
    };
  }

  // Adicionar listener de status
  addStatusListener(callback) {
    this.statusListeners.push(callback);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== callback);
    };
  }

  // Notificar listeners de mensagens
  notifyMessageListeners(mensagem) {
    this.messageListeners.forEach(listener => listener(mensagem));
  }

  // Notificar listeners de status
  notifyStatusListeners(event, data = null) {
    this.statusListeners.forEach(listener => listener(event, data));
  }

  // Verificar se está conectado
  isConnected() {
    return this.connected;
  }

  // Obter sala atual
  getCurrentRoom() {
    return this.currentRoom;
  }
}

// Singleton
const chatService = new ChatService();
export default chatService;