import { supabase } from './supabase';

export async function listarDispositivos() {
    const { data, error } = await supabase
    .from('dispositivos')
    .select('*')
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