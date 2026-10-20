import { useEffect } from 'react';
import { AppState } from 'react-native';
import { supabase } from '../services/supabase';
import { verificarEEnviarNotificacoes } from '../services/monitorAlertasService';

const INTERVALO_RESERVA_MS = 3 * 60 * 1000; // reserva caso o Realtime caia
const INTERVALO_MINIMO_MS = 20 * 1000; // no máximo 1 verificação a cada 20 s
const ESPERA_RAJADA_MS = 3 * 1000; // agrupa leituras que chegam em sequência

/**
 * @param {boolean} ativo  só monitora quando as notificações já foram configuradas
 */
export function useMonitorAlertasForeground(ativo = true) {
  useEffect(() => {
    if (!ativo) return undefined;

    let canal = null;
    let intervaloReserva = null;
    let timeoutAgendado = null;
    let ultimaExecucao = 0;
    let temSessao = false;
    let desmontado = false;

    // Coalescência: vários eventos seguidos viram uma única verificação.
    function agendarVerificacao() {
      if (timeoutAgendado || desmontado) return;

      const desdeUltima = Date.now() - ultimaExecucao;
      const espera = Math.max(ESPERA_RAJADA_MS, INTERVALO_MINIMO_MS - desdeUltima);

      timeoutAgendado = setTimeout(async () => {
        timeoutAgendado = null;
        ultimaExecucao = Date.now();
        try {
          await verificarEEnviarNotificacoes();
        } catch (e) {
          console.warn('Falha ao verificar alertas:', e);
        }
      }, espera);
    }

    function iniciar() {
      if (canal || !temSessao || AppState.currentState !== 'active') return;

      canal = supabase
        .channel('leituras-monitor')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'leituradossensores' },
          agendarVerificacao
        )
        .subscribe();

      intervaloReserva = setInterval(agendarVerificacao, INTERVALO_RESERVA_MS);
      agendarVerificacao();
    }

    function parar() {
      if (canal) {
        supabase.removeChannel(canal);
        canal = null;
      }
      if (intervaloReserva) {
        clearInterval(intervaloReserva);
        intervaloReserva = null;
      }
      if (timeoutAgendado) {
        clearTimeout(timeoutAgendado);
        timeoutAgendado = null;
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      temSessao = !!data?.session;
      iniciar();
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_evento, sessao) => {
      temSessao = !!sessao;
      if (temSessao) iniciar();
      else parar();
    });

    const appStateSub = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') iniciar();
      else parar();
    });

    return () => {
      desmontado = true;
      parar();
      authListener?.subscription?.unsubscribe();
      appStateSub.remove();
    };
  }, [ativo]);
}