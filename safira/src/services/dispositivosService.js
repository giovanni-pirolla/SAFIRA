import { supabase } from './supabase';

export async function listarDispositivos() {
    const { data: userData } = await supabase.auth.getUser();
    const idusuario = userData?.user?.id;

    if (!idusuario) {
        return { data: [], error: { message: 'Usuário não autenticado.' } };
    }

    const { data, error } = await supabase
    .from('dispositivos')
    .select('*')
    .eq('idusuario', idusuario)
    .order('iddispositivos', { ascending: true });
    return {
        data, error
    };
}

export async function criarDispositivo(nome) {
    const { data: userData } = await supabase.auth.getUser();
    const idusuario = userData?.user?.id;

    const { data, error } = await supabase
    .from('dispositivos')
    .insert([{ nome, idusuario }])
    .select()
    .single();
    return {
        data, error
    };
}

export async function atualizarStatusDispositivo(iddispositivos, status) {
    const { data, error } = await supabase
    .from('dispositivos')
    .update({ status })
    .eq('iddispositivos', iddispositivos)
    .select()
    .single();
    return {
        data, error
    };
}