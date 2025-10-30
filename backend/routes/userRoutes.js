// backend/routes/userRoutes.js

const express = require('express');
// IMPORTAÇÃO CORRETA:
const { registerUser, loginUser } = require('../controllers/userController'); 

const router = express.Router();

// Rota de Registro de Usuário
// URL: POST /api/users/register
router.post('/register', registerUser);

// Rota de Login de Usuário
// URL: POST /api/users/login
router.post('/login', loginUser); 

module.exports = router;