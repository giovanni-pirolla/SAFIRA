import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { verificarEEnviarNotificacoes } from '../services/monitorAlertasService';

const INTERVALO_VERIFICACAO_MS = 3 * 60 * 1000; // 3 minutos

export function useMonitorAlertasForeground() {
  const intervaloRef = useRef(null);

  useEffect(() => {
    function iniciarIntervalo() {
      if (intervaloRef.current) return;

      verificarEEnviarNotificacoes();

      intervaloRef.current = setInterval(() => {
        verificarEEnviarNotificacoes();
      }, INTERVALO_VERIFICACAO_MS);
    }

    function pararIntervalo() {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
    }

    iniciarIntervalo();

    const subscription = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') {
        iniciarIntervalo();
      } else {
        pararIntervalo();
      }
    });

    return () => {
      pararIntervalo();
      subscription.remove();
    };
  }, []);
}