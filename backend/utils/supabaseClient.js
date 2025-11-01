// backend/utils/supabaseClient.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Chave pública para o FRONTEND (não é usada aqui, mas mantemos por segurança)
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; 
// NOVO: Chave secreta que o Render vai fornecer
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

// Para chamadas de servidor (Node.js), usamos a chave de administrador.
// O Supabase exige a chave SERVICE_ROLE para operações de registro e manipulação de DB no Backend.
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);

module.exports = supabase;