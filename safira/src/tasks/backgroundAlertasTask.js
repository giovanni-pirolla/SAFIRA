import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import { verificarEEnviarNotificacoes } from '../services/monitorAlertasService';

export const NOME_TAREFA_ALERTAS = 'verificar-alertas-safira';

// Precisa estar no escopo global do módulo (não dentro de componente).
TaskManager.defineTask(NOME_TAREFA_ALERTAS, async () => {
  try {
    await verificarEEnviarNotificacoes();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (erro) {
    console.warn('Task de alertas falhou:', erro);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registrarTarefaBackground() {
  const status = await BackgroundTask.getStatusAsync();
  if (status === BackgroundTask.BackgroundTaskStatus.Restricted) return;

  const jaRegistrada = await TaskManager.isTaskRegisteredAsync(NOME_TAREFA_ALERTAS);
  if (jaRegistrada) return;

  await BackgroundTask.registerTaskAsync(NOME_TAREFA_ALERTAS, {
    minimumInterval: 15, // em MINUTOS; 15 é o mínimo no Android
  });
}