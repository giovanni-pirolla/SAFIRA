import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  createSetWifiConfigPayload,
  createApplyWifiConfigPayload,
  createGetWifiStatusPayload,
  bytesToBase64,
} from '../utils/espProvisioning';

import { BleManager } from 'react-native-ble-plx';

import styles from './estilos/AddDispositivoEstilos';

import { supabase } from '../services/supabase';

const bleManager = new BleManager();

export default function AddDispositivo() {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connectingId, setConnectingId] = useState(null);
  const [connectedDeviceId, setConnectedDeviceId] = useState(null);

// Permissões Bluetooth

  const requestBluetoothPermissions = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    if (Platform.Version >= 31) {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      return (
        permissions[
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
        ] === PermissionsAndroid.RESULTS.GRANTED &&
        permissions[
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        ] === PermissionsAndroid.RESULTS.GRANTED
      );
    }

    return true;
  };

// Busca por dispositivos

  const startScan = async () => {
    const permissionGranted =
      await requestBluetoothPermissions();

    if (!permissionGranted) {
      Alert.alert(
        'Permissão necessária',
        'O SAFIRA precisa de permissão para utilizar o Bluetooth.'
      );

      return;
    }

    setDevices([]);
    setScanning(true);

    console.log('================================');
    console.log('INICIANDO SCAN BLE');
    console.log('================================');

    bleManager.startDeviceScan(
      null,
      {
        allowDuplicates: false,
      },
      (error, device) => {
        if (error) {
          console.log('Erro no scan BLE:', error);

          bleManager.stopDeviceScan();
          setScanning(false);

          return;
        }

        if (!device) {
          return;
        }

        console.log(
          'Dispositivo encontrado:',
          device.name || device.localName || 'Sem nome',
          device.id
        );

        setDevices((currentDevices) => {
          const alreadyExists = currentDevices.some(
            (item) => item.id === device.id
          );

          if (alreadyExists) {
            return currentDevices;
          }

          return [...currentDevices, device];
        });
      }
    );

    setTimeout(() => {
      bleManager.stopDeviceScan();
      setScanning(false);

      console.log('================================');
      console.log('SCAN BLE ENCERRADO');
      console.log('================================');
    }, 10000);
  };

// Conectar ao dispositivo

  const connectToDevice = async (device) => {
    try {
      if (connectingId) {
        return;
      }

      setConnectingId(device.id);

      console.log();
      console.log('================================');
      console.log('TENTANDO CONECTAR');
      console.log('================================');

      console.log('Nome:', device.name);
      console.log('ID:', device.id);

      bleManager.stopDeviceScan();
      setScanning(false);

      // 1. Estabelece a conexão BLE
      const connectedDevice =
        await bleManager.connectToDevice(device.id);

      console.log('Conexão BLE estabelecida!');

      console.log(
        'Dispositivo conectado:',
        connectedDevice.name
      );

      // 2. Descobre serviços e características
      const deviceWithServices =
        await connectedDevice
          .discoverAllServicesAndCharacteristics();

      const PROV_SERVICE_UUID =
        '021a9004-0382-4aea-bff4-6b3f1c5adfb4';

      const PROTO_VER_UUID =
        '021aff53-0382-4aea-bff4-6b3f1c5adfb4';

      const PROV_CONFIG_UUID =
        '021aff52-0382-4aea-bff4-6b3f1c5adfb4';

      console.log();
      console.log('================================');
      console.log('LENDO PROTO-VER');
      console.log('================================');

      const versionRequest = 'e30=';

      console.log('Enviando Get Version Request...');

      await deviceWithServices.writeCharacteristicWithResponseForService(
        PROV_SERVICE_UUID,
        PROTO_VER_UUID,
        versionRequest
      );

      console.log('Get Version Request enviado.');

      const protoVersionCharacteristic =
        await deviceWithServices.readCharacteristicForService(
          PROV_SERVICE_UUID,
          PROTO_VER_UUID
        );

      console.log(
        'Resposta Base64:',
        protoVersionCharacteristic.value
      );

      console.log(
        'Valor recebido:',
        protoVersionCharacteristic.value
      );

      const ssid = 'SKY 34';
      const password = 'Magika34';

      const wifiPayload = createSetWifiConfigPayload(
        ssid,
        password
      );

      const wifiPayloadBase64 = bytesToBase64(wifiPayload);

      console.log('==============================');
      console.log('ENVIANDO CONFIGURAÇÃO WI-FI');
      console.log('==============================');

      console.log('Payload Base64:', wifiPayloadBase64);

      const wifiResponse =
        await deviceWithServices.writeCharacteristicWithResponseForService(
          PROV_SERVICE_UUID,
          PROV_CONFIG_UUID,
          wifiPayloadBase64
        );

      console.log('Resposta do prov-config:', wifiResponse?.value);

      const applyPayload = createApplyWifiConfigPayload();
      const applyPayloadBase64 = bytesToBase64(applyPayload);

      console.log('==============================');
      console.log('APLICANDO CONFIGURAÇÃO WI-FI');
      console.log('==============================');

      console.log('Apply Payload Base64:', applyPayloadBase64);

      const applyResponse =
        await deviceWithServices.writeCharacteristicWithResponseForService(
          PROV_SERVICE_UUID,
          PROV_CONFIG_UUID,
          applyPayloadBase64
        );

      console.log('Resposta do Apply:', applyResponse?.value);

      console.log();
      console.log('================================');
      console.log('SERVIÇOS ENCONTRADOS');
      console.log('================================');

      const services =
        await deviceWithServices.services();

      for (const service of services) {
        console.log();
        console.log('SERVICE:');
        console.log(service.uuid);

        const characteristics =
          await service.characteristics();

        for (const characteristic of characteristics) {
          console.log('  CHARACTERISTIC:');
          console.log('  UUID:', characteristic.uuid);

          console.log(
            '  Read:',
            characteristic.isReadable
          );

          console.log(
            '  Write:',
            characteristic.isWritableWithResponse
          );

          console.log(
            '  Notify:',
            characteristic.isNotifiable
          );
        }
      }

      console.log();
      console.log('================================');
      console.log('DESCOBERTA CONCLUÍDA');
      console.log('================================');

      setConnectedDeviceId(device.id);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Usuário não autenticado.');
      }

      const resposta = await fetch(
        'https://safira-6qma.onrender.com/dispositivos',   // Bentão: 172.17.2.6 | Casa: 192.168.0.26
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idusuario: user.id,
            nome: device.name || 'ESP32-SAFIRA-001',
            id_unico: device.id,
          }),
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.detail || 'Erro ao cadastrar dispositivo.'
        );
      }

      console.log('DISPOSITIVO CADASTRADO:', resultado);

      Alert.alert(
        'Dispositivo conectado',
        `${device.name || 'SAFIRA-ESP32'} foi conectado com sucesso.`
      );
    } catch (error) {
      console.log();
      console.log('================================');
      console.log('ERRO AO CONECTAR');
      console.log('================================');

      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível conectar ao dispositivo.'
      );
    } finally {
      setConnectingId(null);
    }
  };

// Limpa a lista de dispositivos

  useEffect(() => {
    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

// Interface
  return (
    <View style={styles.container}>

      <View style={styles.content}>

        <Text style={styles.title}>
          Conecte seu crachá
        </Text>

        <Text style={styles.description}>
          Ligue seu crachá SAFIRA e mantenha-o próximo
          ao celular.
        </Text>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={startScan}
          disabled={scanning}
        >
          {scanning ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.scanButtonText}>
              Buscar dispositivos
            </Text>
          )}
        </TouchableOpacity>

        {scanning && (
          <View style={styles.buscandoWrapper}>
            <ActivityIndicator
              size="small"
              color="#2F6FED"
            />

            <Text style={styles.buscandoTexto}>
              Buscando dispositivos BLE...
            </Text>
          </View>
        )}

        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          style={styles.deviceList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 10,
          }}
          renderItem={({ item }) => {

            const isConnecting =
              connectingId === item.id;

            const isConnected =
              connectedDeviceId === item.id;

            return (
              <View style={styles.deviceCard}>

                <View style={styles.deviceInfo}>

                  <Text style={styles.deviceName}>
                    {item.name ||
                      item.localName ||
                      'Dispositivo desconhecido'}
                  </Text>

                  <Text style={styles.deviceId}>
                    ID: {item.id}
                  </Text>

                </View>

                <TouchableOpacity
                  style={[
                    styles.connectButton,
                    isConnected &&
                      styles.connectedButton,
                  ]}
                  onPress={() =>
                    connectToDevice(item)
                  }
                  disabled={
                    isConnecting ||
                    isConnected
                  }
                >

                  {isConnecting ? (
                    <ActivityIndicator
                      color={
                        isConnected
                          ? '#2F6FED'
                          : '#FFFFFF'
                      }
                    />
                  ) : (
                    <Text
                      style={
                        isConnected
                          ? styles.connectedButtonText
                          : styles.connectButtonText
                      }
                    >
                      {isConnected
                        ? 'Conectado'
                        : 'Conectar'}
                    </Text>
                  )}

                </TouchableOpacity>

              </View>
            );
          }}
        />

      </View>

    </View>
  );
}