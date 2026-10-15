import { buscarAlertas } from './alertasServices';
import { dispararNotificacaoLocal } from './notificacoesService';

const JANELA_NOTIFICACAO_MS = 3 * 60 * 1000; // mesma janela da transição: 3 minutos

export async function verificarEEnviarNotificacoes() {
  const { alertasPorDia, error } = await buscarAlertas();

  if (error || !alertasPorDia) {
    return { enviados: 0, error };
  }

  const agora = Date.now();
  let enviados = 0;

  for (const grupo of alertasPorDia) {
    for (const alerta of grupo.alertas) {
      if (alerta.tipo !== 'aviso' && alerta.tipo !== 'perigo') continue;

      const timestampAlerta = new Date(alerta.data_hora).getTime();
      const dentroDaJanela = agora - timestampAlerta <= JANELA_NOTIFICACAO_MS;

      if (dentroDaJanela) {
        await dispararNotificacaoLocal({
          titulo: alerta.titulo,
          descricao: alerta.descricao,
          tipo: alerta.tipo,
        });
        enviados += 1;
      }
    }
  }

  return { enviados, error: null };
}