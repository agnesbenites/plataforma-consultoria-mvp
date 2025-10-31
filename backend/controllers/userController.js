// backend/controllers/userController.js (REESCRITO PARA SUPABASE AUTH)

// Importamos o cliente Supabase que criamos (ele já tem as chaves do .env)
const supabase = require('../utils/supabaseClient'); 

// REMOVIDO: const User = require('../models/UserModel');
// REMOVIDO: const bcrypt = require('bcryptjs'); 
// REMOVIDO: const jwt = require('jsonwebtoken'); // O Supabase gera o token internamente

// REMOVIDO: Função generateToken, pois o Supabase retorna o token pronto

// @desc    Registrar um novo usuário (POST /api/users/register)
// @access  Público
exports.registerUser = async (req, res) => {
    // Pegamos os dados do corpo da requisição
    const { name, email, password, type } = req.body;

    try {
        // O método auth.signUp do Supabase cuida de:
        // 1. Verificar unicidade do e-mail.
        // 2. Criptografar a senha.
        // 3. Criar o usuário no sistema de Auth.
        // 4. Enviar e-mail de confirmação.
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            // Usamos a propriedade 'options.data' para salvar metadados (como nome e tipo)
            options: {
                data: {
                    name: name,
                    user_type: type || 'client' // Garante que o tipo padrão seja 'client'
                }
            }
        });

        if (error) {
            // Se houver erro (ex: e-mail inválido, senha muito fraca, etc.)
            return res.status(400).json({ message: error.message });
        }
        
        // Sucesso
        res.status(201).json({ 
            user_id: data.user.id,
            email: data.user.email,
            message: 'Usuário registrado com sucesso. Verifique seu e-mail para validar a conta.'
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Erro no Servidor ao registrar usuário.');
    }
};

// @desc    Autenticar um usuário e obter token (POST /api/users/login)
// @access  Público
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // O método auth.signInWithPassword do Supabase cuida de:
        // 1. Encontrar o usuário.
        // 2. Comparar a senha (criptografada).
        // 3. Retornar um token de sessão válido.
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // Erro de credencial (e-mail ou senha inválidos)
            return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
        }

        // Sucesso: O Supabase retorna o Token de acesso e os dados do usuário
        const user = data.user;
        
        res.json({
            user_id: user.id,
            email: user.email,
            // Acessa o tipo e nome dos metadados que salvamos no registro
            name: user.user_metadata.name,
            type: user.user_metadata.user_type, 
            token: data.session.access_token, // Token JWT fornecido pelo Supabase
            message: 'Login bem-sucedido via Supabase.'
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Erro no Servidor durante o login.');
    }
};