// src/supabaseClient.js
// Inicializa y exporta el cliente de Supabase (usar variables VITE_ desde .env)
import { createClient } from '@supabase/supabase-js';

const URL_SUPABASE = import.meta.env.VITE_SUPABASE_URL;
const KEY_SUPABASE = import.meta.env.VITE_SUPABASE_KEY;

if (!URL_SUPABASE || !KEY_SUPABASE) {
  console.warn('Supabase: faltan variables de entorno VITE_SUPABASE_URL / VITE_SUPABASE_KEY');
}

export const supabase = createClient(URL_SUPABASE, KEY_SUPABASE);