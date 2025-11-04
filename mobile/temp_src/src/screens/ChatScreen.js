// mobile/src/screens/ChatScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { supabase } from '../supabase'; // Importa o cliente Supabase
import AsyncStorage from '@react-native-async-storage/async-storage';

// Nota: O GiftedChat usa uma estrutura de mensagens diferente (IDs, user, text, createdAt)
const mapSupabaseMessage = (msg) => ({
    _id: msg.id,
    text: msg.content,
    createdAt: new Date(msg.created_at),
    user: {
        _id: msg.user_id,
        name: msg.user_type, // 'client' ou 'consultant'
    },
});

const ChatScreen = ({ navigation }) => {
    // GiftedChat espera o array no formato [mais recente, ..., mais antigo]
    const [messages, setMessages] = useState([]); 
    const [userId, setUserId] = useState(null);

    // 1. Carregar ID do Usuário e Mensagens Antigas
    useEffect(() => {
        const loadUserData = async () => {
            const userDataJson = await AsyncStorage.getItem('user');
            if (userDataJson) {
                const userData = JSON.parse(userDataJson);
                // Usamos o ID do Supabase (que está no token/retorno do login)
                setUserId(userData._id); 
            }
        };

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Erro ao buscar mensagens antigas:", error);
                Alert.alert("Erro de Chat", "Não foi possível carregar as mensagens.");
            } else {
                setMessages(data.map(mapSupabaseMessage));
            }
        };

        loadUserData();
        fetchMessages();
    }, []);

    // 2. Conectar ao Supabase Realtime (Receber Novas Mensagens)
    useEffect(() => {
        // 🚨 CRÍTICO: Inscreva-se no canal 'messages' (nome da sua tabela)
        const chatChannel = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                // Quando uma nova mensagem é inserida (INSERT)
                const newMsg = mapSupabaseMessage(payload.new);
                setMessages(previousMessages => GiftedChat.append(previousMessages, [newMsg]));
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Realtime Chat Conectado!');
                }
            });

        // Limpar a conexão ao sair da tela
        return () => {
            supabase.removeChannel(chatChannel);
        };
    }, []);


    // 3. Função de Envio (Insere no DB, e o Realtime faz o resto)
    const onSend = useCallback((newMessages = []) => {
        if (!userId) {
            Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
            return;
        }

        const messageToSend = newMessages[0];
        
        // Insere a mensagem no banco de dados. O Realtime (useEffect acima) se encarrega de exibi-la para todos.
        supabase
            .from('messages')
            .insert([
                { 
                    user_id: userId,
                    content: messageToSend.text,
                    user_type: messageToSend.user.name.toLowerCase() // 'client' ou 'consultant'
                }
            ])
            .then(({ error }) => {
                if (error) {
                    console.error("Erro ao enviar mensagem:", error);
                    Alert.alert("Erro de Envio", "Não foi possível enviar a mensagem.");
                }
            });
            
    }, [userId]);


    if (!userId) {
        return <View style={styles.loadingContainer}><Text>Carregando dados do usuário...</Text></View>;
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{
                _id: userId,
                name: 'Cliente', // Determina quem está enviando
            }}
            renderUsernameOnMessage={true}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ChatScreen;