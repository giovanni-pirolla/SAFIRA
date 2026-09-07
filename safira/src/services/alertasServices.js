import { supabase } from './supabase';

export async function buscarAlertasAtivos() {
    const { data: dispositivos, error: erroDispositivos } = await supabase
    .from('dispositivos')
    .select('iddispositivos, nome, configuracaododispositivo(max_luminosidade, max_temperatura, max_ruidos)');

    if (erroDispositivos) {
        return { alertas: [], error: erroDispositivos };
    }

    const alertas = [];

    for (const disp of dispositivos ?? []) {
        const { data: ultimaLeitura } = await supabase
        .from('leituradossensores')
        .select('*')
        .eq('iddispositivos', disp.iddispositivos)
        .order('data_hora', { ascending: false })
        .limit(1)
        .single();

    const config = disp.configuracaododispositivo;
    if (!ultimaLeitura || !config) continue;

    if (ultimaLeitura.luminosidade > config.max_luminosidade) {
        alertas.push({
        dispositivo: disp.nome,
        tipo: 'Luminosidade',
        valor: ultimaLeitura.luminosidade,
        limite: config.max_luminosidade,
        data_hora: ultimaLeitura.data_hora,
    });
    }
    if (ultimaLeitura.temperatura > config.max_temperatura) {
        alertas.push({
        dispositivo: disp.nome,
        tipo: 'Temperatura',
        valor: ultimaLeitura.temperatura,
        limite: config.max_temperatura,
        data_hora: ultimaLeitura.data_hora,
    });
    }
    if (ultimaLeitura.ruidos > config.max_ruidos) {
        alertas.push({
        dispositivo: disp.nome,
        tipo: 'Ruído',
        valor: ultimaLeitura.ruidos,
        limite: config.max_ruidos,
        data_hora: ultimaLeitura.data_hora,
    });
    }
}

    return {
        alertas, error: null
    };
}