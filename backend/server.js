// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 
const userRoutes = require('./routes/userRoutes'); // Importação da rota de usuário

// --- CONFIGURAÇÃO INICIAL ---

// Carrega as variáveis de ambiente (do arquivo .env)
dotenv.config();

// --- FUNÇÃO DE CONEXÃO COM O DB ---

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Atlas conectado com sucesso!');
    } catch (error) {
        console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// Chama a função de conexão para iniciar a ligação com o MongoDB
connectDB();

// --- CONFIGURAÇÃO DO EXPRESS ---

const app = express();

// Middleware: Permite que o Express leia e entenda dados JSON
// CRÍTICO para receber dados do Thunder Client (email/senha)
app.use(express.json());

// --- ROTAS DA API ---

// 1. Rota de Teste Simples (Health Check)
app.get('/', (req, res) => {
    res.send('API de Consultoria de Compras está rodando!');
});

// 2. Rota Principal de Usuários (Registro e Login)
// Define que a base para todas as rotas de userRoutes será /api/users
app.use('/api/users', userRoutes); // <<< ESTE CAMINHO É CRÍTICO!


// --- INICIALIZAÇÃO DO SERVIDOR ---

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em modo Desenvolvimento na porta ${PORT}`);
});