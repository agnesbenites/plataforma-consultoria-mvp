// mobile/src/screens/ChatScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import io from 'socket.io-client';

// NOTE: Usamos o IP e Porta do servidor (sem o /api)
const SOCKET_URL = 'http://192.168.3.76:8080';
const socket = io(SOCKET_URL, { transports: ['websocket'] });

const ChatScreen = ({ route }) => {
    // Simulamos que o usuário está logado
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    // 1. Efeito para lidar com a conexão Socket.IO
    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
            Alert.alert('Chat Ativo', 'Conectado ao servidor de mensagens.');
        });

        socket.on('receiveMessage', (messageData) => {
            // Adiciona a nova mensagem ao topo da lista
            setMessages((prevMessages) => [messageData, ...prevMessages]);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            Alert.alert('Chat Fechado', 'Conexão perdida.');
        });

        // Limpa listeners ao desmontar a tela
        return () => {
            socket.off('connect');
            socket.off('receiveMessage');
            socket.off('disconnect');
            // IMPORTANTE: Manter o socket.close() desativado no MVP para não fechar a conexão globalmente.
        };
    }, []);

    const sendMessage = () => {
        if (inputMessage.trim() && isConnected) {
            const messageData = {
                id: Date.now(),
                text: inputMessage,
                user: 'Cliente (Você)', // Simulação
                timestamp: new Date().toLocaleTimeString(),
            };
            
            // Envia a mensagem para o servidor (que a retransmite)
            socket.emit('sendMessage', messageData); 
            setInputMessage('');
        }
    };

    const renderMessage = ({ item }) => (
        <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageUser}>{item.user} - {item.timestamp}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
        >
            <Text style={styles.statusText}>Status: {isConnected ? 'Conectado' : 'Desconectado'}</Text>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id.toString()}
                inverted // Mostra as mais novas no topo
                contentContainerStyle={styles.listContainer}
            />
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    placeholder="Digite sua mensagem..."
                />
                <Button title="Enviar" onPress={sendMessage} disabled={!isConnected} />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    statusText: { textAlign: 'center', padding: 10, backgroundColor: '#eee' },
    listContainer: { paddingHorizontal: 10, paddingTop: 10 },
    messageContainer: { backgroundColor: '#fff', padding: 10, borderRadius: 10, marginVertical: 4, maxWidth: '80%', alignSelf: 'flex-start' },
    messageText: { fontSize: 16 },
    messageUser: { fontSize: 10, color: '#666', marginTop: 3 },
    inputContainer: { flexDirection: 'row', padding: 10, alignItems: 'center', borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10 },
});

export default ChatScreen;