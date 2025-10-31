// mobile/src/api/authApi.js

import axios from 'axios';

// ATENÇÃO: Se estiver usando celular ou emulador, substitua 'localhost'
// pelo SEU ENDEREÇO IP LOCAL (ex: 192.168.1.10).
// O servidor backend está rodando na porta 8080.
const BASE_URL = 'http://10.0.2.2:8080/api'; // 10.0.2.2 é o IP padrão para Android Emulator

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export const login = async (email, password) => {
    try {
        const response = await api.post('/users/login', { email, password });
        return response.data; // Retorna { _id, name, email, type, token, message }
    } catch (error) {
        // Captura o erro 401 (Credenciais Inválidas) ou 500
        throw error.response ? error.response.data : new Error('Erro de rede ou conexão.');
    }
};
// Você pode adicionar o register aqui futuramente.