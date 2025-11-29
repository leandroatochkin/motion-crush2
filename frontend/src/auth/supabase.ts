/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js'

console.log(import.meta.env.VITE_SUPABASE_URL)

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
);