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

// Retorna as N leituras mais recentes (a partir de dataInicio), já em ordem cronológica.
export async function buscarUltimasLeituras(iddispositivos, dataInicio, quantidade = 20) {
    let query = supabase
    .from('leituradossensores')
    .select('*')
    .eq('iddispositivos', iddispositivos)
    .order('data_hora', { ascending: false })
    .limit(quantidade);

    if (dataInicio) {
        query = query.gte('data_hora', dataInicio.toISOString());
    }

    const { data, error } = await query;
    return { data: data ? [...data].reverse() : data, error };
}

// Retorna uma linha por dia com a média de luminosidade e ruído (calculada no banco).
export async function buscarMediasDiarias(iddispositivos, dataInicio) {
    const { data, error } = await supabase.rpc('medias_diarias', {
        p_iddispositivos: iddispositivos,
        p_inicio: dataInicio.toISOString(),
    });
    return { data, error };
}

// Retorna apenas a data/hora da última leitura do dispositivo (ou data = null se não houver nenhuma).
export async function buscarDataUltimaLeitura(iddispositivos) {
    const { data, error } = await supabase
    .from('leituradossensores')
    .select('data_hora')
    .eq('iddispositivos', iddispositivos)
    .order('data_hora', { ascending: false })
    .limit(1)
    .maybeSingle();
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