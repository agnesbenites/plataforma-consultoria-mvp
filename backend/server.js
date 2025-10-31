// backend/server.js

const express = require('express');
<<<<<<< HEAD
const http = require('http'); // Servidor HTTP para rodar o Express
const dotenv = require('dotenv');

// Importa o cliente Supabase que gerencia o DB e Auth
const supabase = require('./utils/supabaseClient'); 

const userRoutes = require('./routes/userRoutes'); 

// --- CONFIGURAÇÃO INICIAL ---
dotenv.config();
console.log('PORT carregada do .env:', process.env.PORT);

// --- FUNÇÃO DE TESTE ---
const testSupabaseConnection = () => {
    console.log('✅ Supabase Client inicializado. Verificação de conexão ocorre nas rotas (Auth).');
};
testSupabaseConnection();

// --- CONFIGURAÇÃO DO EXPRESS/HTTP ---
const app = express();

// Middleware: Permite que o Express leia e entenda dados JSON
app.use(express.json());

// Cria um servidor HTTP a partir do Express
const server = http.createServer(app); 

// --- ROTAS DA API ---
app.get('/', (req, res) => {
    if (supabase) {
        res.send('API (Supabase Auth) rodando! Cliente Supabase pronto.');
    } else {
        res.status(500).send('Erro: Cliente Supabase não inicializado.');
    }
});

// Rota de teste para verificar conexão com o Supabase
app.get('/api/test-supabase', async (req, res) => {
    try {
        // Troque 'users' por uma tabela que realmente existe no seu Supabase
        const { data, error } = await supabase.from('users').select('id').limit(1);

        if (error) {
            console.error('❌ Erro ao conectar ao Supabase:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erro de conexão com o Supabase',
                error: error.message
            });
        }

        console.log('✅ Conexão Supabase bem-sucedida.');
        res.json({
            success: true,
            message: 'Conexão Supabase ativa!',
            sampleData: data
        });
    } catch (err) {
        console.error('❌ Erro inesperado:', err);
        res.status(500).json({
            success: false,
            message: 'Erro inesperado',
            error: err.message
        });
    }
});
=======
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
>>>>>>> 519fdcaf641770c5e2b1fea60104cee7a6523764
