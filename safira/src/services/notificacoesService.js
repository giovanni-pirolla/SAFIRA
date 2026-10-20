import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CANAL_ALERTAS = 'alertas-safira';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configurarNotificacoes() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL_ALERTAS, {
      name: 'Alertas Safira',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2F6FED',
    });
  }

  const { status: statusAtual } = await Notifications.getPermissionsAsync();

  let statusFinal = statusAtual;

  if (statusAtual !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    statusFinal = status;
  }

  return statusFinal === 'granted';
}

export async function dispararNotificacaoLocal({ identificador, titulo, descricao, tipo }) {
  await Notifications.scheduleNotificationAsync({
    // Mesmo identificador substitui a notificação anterior em vez de empilhar.
    ...(identificador ? { identifier: identificador } : {}),
    content: {
      title: titulo,
      body: descricao,
      data: { tipo },
      sound: true,
    },
    trigger: Platform.OS === 'android' ? { channelId: CANAL_ALERTAS } : null,
  });
}