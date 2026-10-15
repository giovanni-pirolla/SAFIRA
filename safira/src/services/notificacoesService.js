import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configurarNotificacoes() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alertas-safira', {
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

export async function dispararNotificacaoLocal({ titulo, descricao, tipo }) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: descricao,
      data: { tipo },
      sound: true,
    },
    trigger: null, // dispara imediatamente
  });
}