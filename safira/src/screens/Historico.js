import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { buscarLeituras } from '../services/leiturasService';
import { listarDispositivos } from '../services/dispositivoService';
import { useAuth } from '../contexts/AuthContext';
import styles from './estilos/HistoricoEstilos';

const { width } = Dimensions.get('window');

const infoSensores = {
  luminosidade: {
    nomeLegenda: 'Luminosidade',
    label: 'Luminosidade',
    imageSource: require('../../fotos/icon-sun.png'),
    cor: '#F2A93B',
  },
  ruido: {
    nomeLegenda: 'Ruído',
    label: 'Ruído',
    imageSource: require('../../fotos/icon-sound.png'),
    cor: '#1B2A4A',
  },
  temperatura: {
    nomeLegenda: 'Temperatura',
    label: 'Temperatura',
    imageSource: require('../../fotos/icon-temperature.png'),
    cor: '#2F6FED',
  },
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
  const { session } = useAuth();
  const idusuario = session?.user?.id;

  const [iddispositivos, setIddispositivos] = useState(route?.params?.iddispositivos ?? null);
  const [periodoAtivo, setPeriodoAtivo] = useState('Hoje');
  const [sensorAtivo, setSensorAtivo] = useState('todos');
  const [leituras, setLeituras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Caso a tela não receba o iddispositivos por parâmetro,
  // busca automaticamente o dispositivo do usuário logado.
  const resolverDispositivo = useCallback(async () => {
    if (route?.params?.iddispositivos) {
      setIddispositivos(route.params.iddispositivos);
      return;
    }

    if (!idusuario) {
      setErro('Usuário não autenticado.');
      setCarregando(false);
      return;
    }

    const { data, error } = await listarDispositivos();

    if (error) {
      setErro(error.message);
      setCarregando(false);
      return;
    }

    const dispositivoDoUsuario = data?.[0];

    if (!dispositivoDoUsuario) {
      setErro('Nenhum dispositivo encontrado para este usuário.');
      setCarregando(false);
      return;
    }

    setIddispositivos(dispositivoDoUsuario.iddispositivos);
  }, [route?.params?.iddispositivos, idusuario]);

  useEffect(() => {
    resolverDispositivo();
  }, [resolverDispositivo]);

  const carregarLeituras = useCallback(async () => {
    if (!iddispositivos) return;

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
      data: leituras.map((l) => (l.luminosidade !== null ? Number(l.luminosidade) : null)),
    },
    {
      id: 'ruido',
      ...infoSensores.ruido,
      data: leituras.map((l) => (l.ruidos !== null ? Number(l.ruidos) : null)),
    },
    {
      id: 'temperatura',
      ...infoSensores.temperatura,
      emBreve: true,
      data: [],
    },
  ];

  const sensoresParaExibir =
    sensorAtivo === 'todos'
      ? sensoresDisponiveis
      : sensoresDisponiveis.filter((s) => s.id === sensorAtivo);

  // Enquanto o sensor "temperatura" não coleta dados reais,
  // ele é excluído do gráfico e tratado como aviso cinematográfico.
  const sensoresComDadosReais = sensoresParaExibir.filter((s) => !s.emBreve);
  const exibirApenasAvisoTemperatura =
    sensorAtivo === 'temperatura' && sensoresComDadosReais.length === 0;

  const dadosGrafico = {
    labels: labels.length > 0 ? labels : [''],
    datasets:
      sensoresComDadosReais.length > 0
        ? sensoresComDadosReais.map((sensor) => ({
            data: sensor.data.length > 0 ? sensor.data.map((v) => v ?? 0) : [0],
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

        {/* Filtro de sensores com imagens */}
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
                <View style={styles.sensorButtonContent}>
                  <Image
                    source={sensor.imageSource}
                    style={[styles.sensorIcon, { tintColor: ativo ? '#FFFFFF' : sensor.cor }]}
                    resizeMode="contain"
                  />
                  <Text style={[styles.sensorText, ativo && styles.sensorTextAtivo]}>
                    {sensor.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Visão geral do dia</Text>

        {erro ? (
          <Text style={{ color: '#E44B4B', fontSize: 13, marginTop: 10 }}>{erro}</Text>
        ) : carregando ? (
          <Text style={{ color: '#8A8A8A', fontSize: 13, marginTop: 10 }}>Carregando...</Text>
        ) : exibirApenasAvisoTemperatura ? (
          <View style={styles.avisoTemperaturaWrapper}>
            <Text style={styles.avisoTemperaturaTexto}>
              ESTAMOS TRABALHANDO NESSA FUNÇÃO!{'\n'}EM BREVE - 2027
            </Text>
          </View>
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

            {/* Legenda com imagens */}
            <View style={styles.legendWrapper}>
              {sensoresComDadosReais.map((sensor) => (
                <View key={sensor.id} style={styles.legendItem}>
                  <Image
                    source={sensor.imageSource}
                    style={[styles.legendIcon, { tintColor: sensor.cor }]}
                    resizeMode="contain"
                  />
                  <Text style={styles.legendText}>{sensor.nomeLegenda}</Text>
                </View>
              ))}
            </View>

            {/* Aviso de temperatura quando "Todos" está selecionado */}
            {sensorAtivo === 'todos' && (
              <View style={styles.avisoTemperaturaWrapperPequeno}>
                <Image
                  source={infoSensores.temperatura.imageSource}
                  style={[styles.legendIcon, { tintColor: infoSensores.temperatura.cor }]}
                  resizeMode="contain"
                />
                <Text style={styles.avisoTemperaturaTextoPequeno}>
                  Temperatura: ESTAMOS TRABALHANDO NESSA FUNÇÃO! EM BREVE - 2027
                </Text>
              </View>
            )}
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