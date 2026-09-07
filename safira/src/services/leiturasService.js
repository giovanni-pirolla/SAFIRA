import { supabase } from './supabase';

export async function buscarLeituras(iddispositivos, dataInicio, limite = 100) {
    let query = supabase
    .from('leituradossensores')
    .select('*')
    .eq('iddispositivos', iddispositivos)
    .order('data_hora', { ascending: true })
    .limit(limite);

    if (dataInicio) {
        query = query.gte('data_hora', dataInicio.toISOString());
    }

    const { data, error } = await query;
    return { data, error };
}

export async function buscarUltimaLeitura(iddispositivos) {
    const { data, error } = await supabase
    .from('leituradossensores')
    .select('*')
    .eq('iddispositivos', iddispositivos)
    .order('data_hora', { ascending: false })
    .limit(1)
    .single();
    return {
        data, error
    };
}

export async function contarLeituras(iddispositivos) {
    const { count, error } = await supabase
    .from('leituradossensores')
    .select('*', { count: 'exact', head: true })
    .eq('iddispositivos', iddispositivos);
    return {
        count: count ?? 0, error
    };
}