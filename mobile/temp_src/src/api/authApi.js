// mobile/src/api/authApi.js

import axios from 'axios';

// URL PÚBLICA do Render (Substitua se a sua URL do Render for diferente)
const RENDER_URL = 'https://plataforma-consultoria-mvp.onrender.com'; 

// CRÍTICO: Usa template string (crase) e interpolação para construir o link
const BASE_URL = `${RENDER_URL}/api`; 

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export const login = async (email, password) => {
    try {
        const response = await api.post('/users/login', { email, password });
        // O Backend Supabase retorna os dados de usuário e token
        return response.data; 
    } catch (error) {
        // Captura o erro 401 (Credenciais Inválidas) ou 500
        throw error.response 
              ? error.response.data 
              : new Error('Erro de rede ou conexão. Verifique o status do servidor Render.');
    }
};
// Você pode adicionar o export para o register aqui, se necessário