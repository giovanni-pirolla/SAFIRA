// App.js
import React, { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { configurarNotificacoes } from './services/notificacoesService';
import { useMonitorAlertasForeground } from './hooks/useMonitorAlertasForeground';
import { registrarTarefaBackground } from './tasks/backgroundAlertasTask';

export default function App() {
  useMonitorAlertasForeground();

  useEffect(() => {
    async function iniciar() {
      await configurarNotificacoes();
      await registrarTarefaBackground();
    }

    iniciar();
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}