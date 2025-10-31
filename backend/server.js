// backend/server.js

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const supabase = require('./utils/supabaseClient');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());

// Rotas da API
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API de Consultoria de Compras rodando via Supabase!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
