// mobile/src/screens/LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { login } from '../api/authApi';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const userData = await login(email, password);
            
            // Sucesso: Salvar o token (Futura Sprint 3: Salvar em Context)
            Alert.alert('Sucesso', `Login efetuado! Token recebido: ${userData.token.substring(0, 20)}...`);
            
            // Navega para a Home (simulando login completo)
            navigation.replace('Home'); 

        } catch (error) {
            const errorMessage = error.message || 'Falha na conexão ou credenciais inválidas.';
            Alert.alert('Erro no Login', errorMessage);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Plataforma Consultoria MVP</Text>
            
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <Button 
                title={loading ? "Entrando..." : "Entrar"} 
                onPress={handleLogin} 
                disabled={loading} 
            />

            <Button
                title="Não tem conta? Cadastre-se"
                onPress={() => navigation.navigate('Register')}
                type="clear"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 8, backgroundColor: '#fff' },
});

export default LoginScreen;