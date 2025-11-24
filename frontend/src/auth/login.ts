import { supabase } from "./supabase"

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export async function signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  return { data, error }
}

export async function logout() {
  await supabase.auth.signOut()
}

export const googleLogin = async () => await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${import.meta.env.VITE_FRONTEND_URL}/draw` }
})

