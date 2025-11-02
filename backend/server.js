// backend/server.js (CÓDIGO FINAL COM CORS)

const express = require('express');
const http = require('http'); 
const dotenv = require('dotenv');
const cors = require('cors'); // <<< IMPORTAÇÃO NOVA

const supabase = require('./utils/supabaseClient'); 
const userRoutes = require('./routes/userRoutes'); 

// --- CONFIGURAÇÃO INICIAL ---
dotenv.config();

// --- FUNÇÃO DE TESTE ---
const testSupabaseConnection = () => {
    console.log('✅ Supabase Client inicializado. Verificação de conexão ocorre nas rotas (Auth).');
};
testSupabaseConnection();


// --- CONFIGURAÇÃO DO EXPRESS/HTTP ---
const app = express();

// Defina as origens permitidas (seu local/dev e a URL do Render)
const allowedOrigins = [
    'http://localhost:5173', // SEU FRONTEND WEB LOCAL
    'https://plataforma-consultoria-mvp.onrender.com' // Sua URL pública
];

// CRÍTICO: CONFIGURAÇÃO DO CORS
app.use(cors({
    origin: (origin, callback) => {
        // Permite requisições sem 'origin' (como apps móveis ou Postman)
        if (!origin) return callback(null, true); 
        
        // Verifica se a origem está na lista de permitidas
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Acesso CORS não permitido por esta origem'), false);
        }
    }
}));


app.use(express.json());

const server = http.createServer(app); 

// --- ROTAS DA API ---
app.get('/', (req, res) => {
    if (supabase) {
        res.send('API de Consultoria de Compras (Supabase) rodando!');
    } else {
        res.status(500).send('Erro: Cliente Supabase não inicializado.');
    }
});

app.use('/api/users', userRoutes); 


// --- INICIALIZAÇÃO DO SERVIDOR ---

const PORT = process.env.PORT || 8080; 

server.listen(PORT, () => { 
    console.log(`Servidor HTTP (Supabase Auth) rodando na porta ${PORT}`);
});