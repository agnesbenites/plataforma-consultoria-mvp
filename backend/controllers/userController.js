// backend/controllers/userController.js

const supabase = require('../utils/supabaseClient');

// Registrar usuário
exports.registerUser = async (req, res) => {
  const { name, email, password, type } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          user_type: type || 'client'
        }
      }
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({
      user_id: data.user.id,
      email: data.user.email,
      message: 'Usuário registrado com sucesso. Verifique seu e-mail.'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor ao registrar usuário.');
  }
};

// Login de usuário
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    res.json({
      user_id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata.name,
      type: data.user.user_metadata.user_type,
      token: data.session.access_token,
      message: 'Login bem-sucedido via Supabase.'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor durante o login.');
  }
};
