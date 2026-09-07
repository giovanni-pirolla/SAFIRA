import { supabase } from './supabase';

export async function cadastrar(nome, email, senha) {
    const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
    data: { nome },
    },
  });
  return {
    data, error
};
}

export async function login(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
    });
    return {
        data, error
    };
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    return { error };
}