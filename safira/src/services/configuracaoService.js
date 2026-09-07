import { supabase } from './supabase';

export async function buscarConfiguracao(iddispositivos) {
    const { data, error } = await supabase
    .from('configuracaododispositivo')
    .select('*')
    .eq('iddispositivos', iddispositivos)
    .single();
    return {
        data, error
    };
}

export async function salvarConfiguracao(iddispositivos, valores) {
  // valores = { max_luminosidade, max_temperatura, max_ruidos }
    const { data, error } = await supabase
    .from('configuracaododispositivo')
    .upsert({ iddispositivos, ...valores }, { onConflict: 'iddispositivos' })
    .select()
    .single();
    return {
        data, error
    };
}