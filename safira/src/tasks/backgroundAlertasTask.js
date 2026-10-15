import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import { verificarEEnviarNotificacoes } from '../services/monitorAlertasService';

export const NOME_TAREFA_ALERTAS = 'verificar-alertas-safira';

TaskManager.defineTask(NOME_TAREFA_ALERTAS, async () => {
  try {
    const { enviados } = await verificarEEnviarNotificacoes();
    return enviados > 0
      ? BackgroundTask.BackgroundTaskResult.NewData
      : BackgroundTask.BackgroundTaskResult.NoData;
  } catch (erro) {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registrarTarefaBackground() {
  const jaRegistrada = await TaskManager.isTaskRegisteredAsync(NOME_TAREFA_ALERTAS);

  if (jaRegistrada) return;

  await BackgroundTask.registerTaskAsync(NOME_TAREFA_ALERTAS, {
    minimumInterval: 3 * 60, // em segundos; o SO pode espaçar mais que isso
  });
}