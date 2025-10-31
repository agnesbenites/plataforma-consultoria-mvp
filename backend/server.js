// backend/server.js

const express = require('express');
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
