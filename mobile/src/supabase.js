// mobile/src/supabase.js

import { createClient } from '@supabase/supabase-js';

// ** ATENÇÃO: Substitua pelos SEUS dados do Supabase **
const supabaseUrl = 'https://vluxffbornrlxcepqmzr.supabase.co'; // Sua URL
const supabaseAnonKey = 'zgWkHFqEhc8IJKUurmQZe2mndJsN/Q7U9j8g2ciSp5TPQf662YK0IjjmaWhKQGRUlzP1hZ2fx0HohdsqRV0/wQ=='; // Sua Chave Anon

export const supabase = createClient(supabaseUrl, supabaseAnonKey);