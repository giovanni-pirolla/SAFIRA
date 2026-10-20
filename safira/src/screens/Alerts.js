// Alerts.js
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import styles from './estilos/AlertsEstilos';
import { buscarAlertas } from '../services/alertasServices';
import { Ionicons } from '@expo/vector-icons';
import BarraNavegacao from '../components/BarraNavegacao';


function AlertaCard({ tipo, titulo, hora, descricao }) {
  const configPorTipo = {
    aviso: {
      simbolo: 'alert-circle-outline',
      corIcone: styles.iconeAviso,
      corBolinha: styles.bolinhaAviso,
      cor: '#ffffff',
      size: 32,
    },
    perigo: {
      simbolo: 'warning-outline',
      corIcone: styles.iconePerigo,
      corBolinha: styles.bolinhaPerigo,
      cor: '#ffffff',
      size: 32,
    },
    sucesso: {
      simbolo: 'checkmark-circle-outline',
      corIcone: styles.iconeSucesso,
      corBolinha: styles.bolinhaSucesso,
      cor: '#ffffff',
      size: 32,
    },
  };

  const {
    simbolo,
    corIcone,
    corBolinha,
    cor,
  } = configPorTipo[tipo] || configPorTipo.aviso;

  return (
    <View style={styles.card}>
      <View style={corIcone}>
        <Ionicons
          name={simbolo}
          size={22}
          color={cor}
        />
      </View>

      <View style={styles.cardConteudo}>
        <View style={styles.cardHeaderLinha}>
          <Text style={styles.cardTitulo}>{titulo}</Text>
          <Text style={styles.cardHora}>{hora}</Text>
        </View>

        <Text style={styles.cardDescricao}>{descricao}</Text>
      </View>

      <View style={[styles.bolinha, corBolinha]} />
    </View>
  );
}


export default function Alerts({ navigation }) {
  const [alertasPorDia, setAlertasPorDia] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarAlertas = useCallback(async () => {
    setCarregando(true);
    setErro('');

    const { alertasPorDia: dados, error } = await buscarAlertas();

    if (error) {
      setErro('Não foi possível carregar os alertas.');
      setCarregando(false);
      return;
    }

    setAlertasPorDia(dados);
    setCarregando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarAlertas();
    }, [carregarAlertas])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alertas</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {erro ? (
          <Text style={{ color: '#E44B4B', fontSize: 13, marginTop: 10 }}>{erro}</Text>
        ) : carregando ? (
          <Text style={{ color: '#8A8A8A', fontSize: 13, marginTop: 10 }}>Carregando...</Text>
        ) : alertasPorDia.length === 0 ? (
          <Text style={{ color: '#8A8A8A', fontSize: 13, marginTop: 10 }}>
            Nenhum alerta registrado nos últimos dias.
          </Text>
        ) : (
          alertasPorDia.map((grupo) => (
            <View key={grupo.dia}>
              <Text style={styles.secao}>{grupo.dia}</Text>
              {grupo.alertas.map((alerta, index) => (
                <AlertaCard
                  key={`${grupo.dia}-${index}`}
                  tipo={alerta.tipo}
                  titulo={alerta.titulo}
                  hora={alerta.hora}
                  descricao={alerta.descricao}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Rodapé de navegação */}
      <BarraNavegacao
        navigation={navigation}
      />
    </SafeAreaView>
  );
}