<<<<<<< HEAD
// backend/controllers/userController.js (REESCRITO PARA SUPABASE AUTH)

// Importamos o cliente Supabase que criamos (ele já tem as chaves do .env)
const supabase = require('../utils/supabaseClient'); 

// REMOVIDO: const User = require('../models/UserModel');
// REMOVIDO: const bcrypt = require('bcryptjs'); 
// REMOVIDO: const jwt = require('jsonwebtoken'); // O Supabase gera o token internamente

// REMOVIDO: Função generateToken, pois o Supabase retorna o token pronto
=======
// backend/controllers/userController.js

const User = require('../models/UserModel');
const bcrypt = require('bcryptjs'); // Para criptografar senhas
const jwt = require('jsonwebtoken'); // Para gerar o Token de acesso

// Função auxiliar para gerar o Token JWT
const generateToken = (id) => {
    // Usa o ID do usuário e a chave secreta do .env para assinar o token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // O token expira em 30 dias
    });
};
>>>>>>> 519fdcaf641770c5e2b1fea60104cee7a6523764

// @desc    Registrar um novo usuário (POST /api/users/register)
// @access  Público
exports.registerUser = async (req, res) => {
<<<<<<< HEAD
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
=======
    const { name, email, password, type } = req.body;

    try {
        // 1. Verificação: E-mail já existe?
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
        }

        // 2. Segurança: Criptografar a senha (Hash)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Criação do Usuário
        user = new User({
            name,
            email,
            password: hashedPassword,
            type: type || 'client' // Garante que, se não for enviado, o tipo seja 'client'
        });

        // 4. Salvar no MongoDB
        await user.save();

        // 5. Resposta de sucesso (sem enviar a senha)
        res.status(201).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            type: user.type,
            message: 'Usuário registrado com sucesso. Validação de e-mail pendente.'
>>>>>>> 519fdcaf641770c5e2b1fea60104cee7a6523764
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
<<<<<<< HEAD
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

=======
        // 1. Encontrar o usuário pelo e-mail
        const user = await User.findOne({ email });

        // 2. Comparar a senha fornecida com o hash salvo no banco
        if (user && (await bcrypt.compare(password, user.password))) {
            // 3. Senha correta: retorna o Token JWT e os dados básicos
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                type: user.type,
                token: generateToken(user._id), // <<< Gera o Token de acesso
                message: 'Login bem-sucedido.'
            });
        } else {
            // 4. Senha/E-mail incorretos
            res.status(401).json({ message: 'E-mail ou senha inválidos.' });
        }

>>>>>>> 519fdcaf641770c5e2b1fea60104cee7a6523764
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Erro no Servidor durante o login.');
    }
};