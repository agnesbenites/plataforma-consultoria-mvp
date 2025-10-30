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

// @desc    Registrar um novo usuário (POST /api/users/register)
// @access  Público
exports.registerUser = async (req, res) => {
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

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Erro no Servidor durante o login.');
    }
};