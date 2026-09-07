import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { buscarLeituras } from '../services/leiturasService';
import styles from './estilos/HistoricoEstilos';

const { width } = Dimensions.get('window');

const infoSensores = {
  luminosidade: { nomeLegenda: 'Luminosidade', label: '☀️ Luminosidade', cor: '#F2A93B' },
  ruido: { nomeLegenda: 'Ruído', label: '🔊 Ruído', cor: '#1B2A4A' },
  temperatura: { nomeLegenda: 'Temperatura', label: '🌡️ Temperatura', cor: '#2F6FED' },
};

const periodos = ['Hoje', '7 Dias', '30 Dias'];

function calcularDataInicio(periodo) {
  const agora = new Date();
  if (periodo === 'Hoje') {
    agora.setHours(0, 0, 0, 0);
    return agora;
  }
  if (periodo === '7 Dias') {
    agora.setDate(agora.getDate() - 7);
    return agora;
  }
  agora.setDate(agora.getDate() - 30);
  return agora;
}

export default function Historico({ navigation, route }) {
  const iddispositivos = route?.params?.iddispositivos;

  const [periodoAtivo, setPeriodoAtivo] = useState('Hoje');
  const [sensorAtivo, setSensorAtivo] = useState('todos');
  const [leituras, setLeituras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarLeituras = useCallback(async () => {
    if (!iddispositivos) {
      setErro('Nenhum dispositivo selecionado.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro('');

    const dataInicio = calcularDataInicio(periodoAtivo);
    const { data, error } = await buscarLeituras(iddispositivos, dataInicio, 200);

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setLeituras(data ?? []);
  }, [iddispositivos, periodoAtivo]);

  useEffect(() => {
    carregarLeituras();
  }, [carregarLeituras]);

  const labels = leituras.map((l) =>
    new Date(l.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );

  const sensoresDisponiveis = [
    {
      id: 'luminosidade',
      ...infoSensores.luminosidade,
      data: leituras.map((l) => Number(l.luminosidade)),
    },
    {
      id: 'ruido',
      ...infoSensores.ruido,
      data: leituras.map((l) => Number(l.ruidos)),
    },
    {
      id: 'temperatura',
      ...infoSensores.temperatura,
      data: leituras.map((l) => Number(l.temperatura)),
    },
  ];

  const sensoresParaExibir =
    sensorAtivo === 'todos'
      ? sensoresDisponiveis
      : sensoresDisponiveis.filter((s) => s.id === sensorAtivo);

  const dadosGrafico = {
    labels: labels.length > 0 ? labels : [''],
    datasets:
      sensoresParaExibir.length > 0
        ? sensoresParaExibir.map((sensor) => ({
            data: sensor.data.length > 0 ? sensor.data : [0],
            color: () => sensor.cor,
            strokeWidth: 2.5,
          }))
        : [{ data: [0], color: () => '#D9D9D9', strokeWidth: 2.5 }],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* Filtro de período */}
        <View style={styles.periodoWrapper}>
          {periodos.map((periodo) => {
            const ativo = periodoAtivo === periodo;
            return (
              <TouchableOpacity
                key={periodo}
                style={[styles.periodoButton, ativo && styles.periodoButtonAtivo]}
                onPress={() => setPeriodoAtivo(periodo)}
              >
                <Text style={[styles.periodoText, ativo && styles.periodoTextAtivo]}>
                  {periodo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Filtro de sensores */}
        <View style={styles.sensorWrapper}>
          <TouchableOpacity
            style={[styles.sensorButton, sensorAtivo === 'todos' && styles.sensorButtonAtivo]}
            onPress={() => setSensorAtivo('todos')}
          >
            <Text style={[styles.sensorText, sensorAtivo === 'todos' && styles.sensorTextAtivo]}>
              Todos
            </Text>
          </TouchableOpacity>
          {sensoresDisponiveis.map((sensor) => {
            const ativo = sensorAtivo === sensor.id;
            return (
              <TouchableOpacity
                key={sensor.id}
                style={[styles.sensorButton, ativo && styles.sensorButtonAtivo]}
                onPress={() => setSensorAtivo(sensor.id)}
              >
                <Text style={[styles.sensorText, ativo && styles.sensorTextAtivo]}>
                  {sensor.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Visão geral do dia</Text>

        {erro ? (
          <Text style={{ color: '#E44B4B', fontSize: 13, marginTop: 10 }}>{erro}</Text>
        ) : carregando ? (
          <Text style={{ color: '#8A8A8A', fontSize: 13, marginTop: 10 }}>Carregando...</Text>
        ) : leituras.length === 0 ? (
          <Text style={{ color: '#8A8A8A', fontSize: 13, marginTop: 10 }}>
            Nenhuma leitura encontrada nesse período.
          </Text>
        ) : (
          <>
            {/* Gráfico */}
            <LineChart
              data={dadosGrafico}
              width={width * 0.92}
              height={210}
              fromZero
              segments={4}
              formatYLabel={(y) => `${Math.round(y)}`}
              withShadow={false}
              withInnerLines={true}
              withOuterLines={false}
              chartConfig={{
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: () => '#D9D9D9',
                labelColor: () => '#8A8A8A',
                propsForDots: {
                  r: '3',
                },
                propsForBackgroundLines: {
                  stroke: '#EDEDED',
                },
              }}
              bezier={false}
              style={styles.chart}
            />

            {/* Legenda */}
            <View style={styles.legendWrapper}>
              {sensoresParaExibir.map((sensor) => (
                <View key={sensor.id} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: sensor.cor }]} />
                  <Text style={styles.legendText}>{sensor.nomeLegenda}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      {/* Rodapé de navegação */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItem} onPress={() => navigation.navigate('TelaInicial')}>
          <Text style={styles.bottomText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}>
          <Text style={[styles.bottomText, styles.bottomTextActive]}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem} onPress={() => navigation.navigate('Dispositivos')}>
          <Text style={styles.bottomText}>Dispositivos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem} onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}