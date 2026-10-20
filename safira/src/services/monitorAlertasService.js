import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarAlertas } from './alertasServices';
import { dispararNotificacaoLocal } from './notificacoesService';

const CHAVE_VISTOS = '@safira/alertas_vistos_v2';
const CHAVE_COOLDOWN = '@safira/alertas_cooldown_v2';

// Mesmo tipo de alerta (ex.: "Ruído Elevado(a)") só notifica de novo após este tempo.
const COOLDOWN_MS = 5 * 60 * 1000;
// Acima disso, em uma mesma verificação, envia um único resumo em vez de várias.
const MAX_NOTIFICACOES_INDIVIDUAIS = 2;

let emExecucao = false;

async function lerJSON(chave, padrao) {
  try {
    const bruto = await AsyncStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
}

const chaveDoAlerta = (a) => `${a.titulo}|${a.data_hora}`;

export async function verificarEEnviarNotificacoes() {
  if (emExecucao) return { enviados: 0, error: null };
  emExecucao = true;

  try {
    const { alertasPorDia, error } = await buscarAlertas();
    if (error || !alertasPorDia) {
      if (error) console.warn('Monitor de alertas:', error?.message ?? error);
      return { enviados: 0, error };
    }

    const candidatos = alertasPorDia
      .flatMap((g) => g.alertas)
      .filter((a) => a.tipo === 'aviso' || a.tipo === 'perigo')
      .map((a) => ({ ...a, ts: new Date(a.data_hora).getTime(), chave: chaveDoAlerta(a) }))
      .sort((a, b) => a.ts - b.ts);

    const chavesAtuais = candidatos.map((a) => a.chave);
    const vistosSalvos = await lerJSON(CHAVE_VISTOS, null);

    // Persiste ANTES de enviar. Só guarda o que existe na janela atual (se auto-limpa).
    await AsyncStorage.setItem(CHAVE_VISTOS, JSON.stringify(chavesAtuais));

    // Primeira execução: marca o histórico como visto e não notifica nada antigo.
    if (vistosSalvos === null) return { enviados: 0, error: null };

    const vistos = new Set(vistosSalvos);
    const novos = candidatos.filter((a) => !vistos.has(a.chave));
    if (novos.length === 0) return { enviados: 0, error: null };

    // Cooldown por tipo de alerta, para não repetir em oscilações rápidas.
    const agora = Date.now();
    const cooldown = await lerJSON(CHAVE_COOLDOWN, {});
    const elegiveis = [];
    const reservados = {};

    for (const alerta of novos) {
      const ultimo = reservados[alerta.titulo] ?? cooldown[alerta.titulo] ?? 0;
      if (agora - ultimo < COOLDOWN_MS) continue;
      reservados[alerta.titulo] = agora;
      elegiveis.push(alerta);
    }

    if (elegiveis.length === 0) return { enviados: 0, error: null };

    const novoCooldown = { ...cooldown, ...reservados };
    for (const k of Object.keys(novoCooldown)) {
      if (agora - novoCooldown[k] > COOLDOWN_MS * 12) delete novoCooldown[k];
    }
    await AsyncStorage.setItem(CHAVE_COOLDOWN, JSON.stringify(novoCooldown));

    if (elegiveis.length <= MAX_NOTIFICACOES_INDIVIDUAIS) {
      for (const alerta of elegiveis) {
        await dispararNotificacaoLocal({
          identificador: alerta.chave,
          titulo: alerta.titulo,
          descricao: alerta.descricao,
          tipo: alerta.tipo,
        });
      }
      return { enviados: elegiveis.length, error: null };
    }

    const temPerigo = elegiveis.some((a) => a.tipo === 'perigo');
    const titulos = [...new Set(elegiveis.map((a) => a.titulo))].join(', ');
    await dispararNotificacaoLocal({
      identificador: 'resumo-alertas',
      titulo: `${elegiveis.length} novos alertas`,
      descricao: titulos,
      tipo: temPerigo ? 'perigo' : 'aviso',
    });
    return { enviados: 1, error: null };
  } finally {
    emExecucao = false;
  }
}