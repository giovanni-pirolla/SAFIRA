import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '../services/supabase';
import { buscarUltimasLeituras, buscarMediasDiarias } from '../services/leiturasService';
import { listarDispositivos } from '../services/dispositivosService';
import { useAuth } from '../contexts/AuthContext';
import styles from './estilos/HistoricoEstilos';
import BarraNavegacao from '../components/BarraNavegacao';

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

// Quantidade de leituras recentes exibidas no filtro "Hoje" (ajuste se quiser mais/menos pontos).
const QTD_ULTIMAS_LEITURAS = 20;

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

// Intervalo mínimo entre atualizações das médias diárias (7 e 30 dias).
// Uma leitura nova quase não muda a média do dia, então não vale refazer a consulta a cada leitura.
const INTERVALO_MIN_ATUALIZAR_MEDIAS_MS = 30000;

// Colunas "numeric" podem chegar como texto; converte para número e mantém null se não houver valor
const paraNumero = (valor) => (valor === null || valor === undefined ? null : Number(valor));

// Converte o texto de data do banco em Date, tolerando formatos como "2026-10-19 15:00:21+00"
function lerData(valor) {
  const data = new Date(valor);
  if (!Number.isNaN(data.getTime())) return data;
  return new Date(String(valor).replace(' ', 'T').replace(/([+-]\d{2})$/, '$1:00'));
}

// Converte uma linha da tabela de leituras no formato usado pelo gráfico "Hoje"
function formatarLeituraDoDia(l) {
  const data = lerData(l.data_hora);
  return {
    instante: data.getTime(),
    label: data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    luminosidade: paraNumero(l.luminosidade),
    ruidos: paraNumero(l.ruidos),
  };
}

// Acrescenta uma leitura nova ao gráfico "Hoje": sem repetir, em ordem de horário,
// mantendo só as QTD_ULTIMAS_LEITURAS mais recentes (a mais antiga sai).
function adicionarLeitura(atuais, nova) {
  const item = formatarLeituraDoDia(nova);
  const base = atuais.filter((l) => l.instante != null);

  if (base.some((l) => l.instante === item.instante)) return atuais;

  return [...base, item]
    .sort((a, b) => a.instante - b.instante)
    .slice(-QTD_ULTIMAS_LEITURAS);
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

  const requisicaoRef = useRef(0);
  const periodoRef = useRef(periodoAtivo);
  const ultimaAtualizacaoMediasRef = useRef(0);

  // silencioso = atualização em segundo plano: não mostra "Carregando..." nem apaga o gráfico
  const carregarLeituras = useCallback(
    async ({ silencioso = false } = {}) => {
      if (!iddispositivos) return;

      // Só a requisição mais recente pode atualizar a tela
      // (evita que uma resposta antiga sobrescreva uma mais nova)
      const idRequisicao = ++requisicaoRef.current;

      if (!silencioso) {
        setCarregando(true);
        setErro('');
      }

      const dataInicio = calcularDataInicio(periodoAtivo);
      const hoje = periodoAtivo === 'Hoje';

      // "Hoje": últimas leituras. 7 e 30 dias: média diária calculada no banco (uma linha por dia).
      const { data, error } = hoje
        ? await buscarUltimasLeituras(iddispositivos, dataInicio, QTD_ULTIMAS_LEITURAS)
        : await buscarMediasDiarias(iddispositivos, dataInicio);

      if (idRequisicao !== requisicaoRef.current) return;

      setCarregando(false);

      if (error) {
        if (!silencioso) setErro(error.message);
        return;
      }

      setErro('');

      if (hoje) {
        setLeituras(
          (data ?? []).map(formatarLeituraDoDia).sort((a, b) => a.instante - b.instante)
        );
        return;
      }

      setLeituras(
        (data ?? []).map((m) => {
          const [, mes, dia] = m.dia.split('-');
          return {
            instante: null,
            label: `${dia}/${mes}`,
            luminosidade: paraNumero(m.luminosidade),
            ruidos: paraNumero(m.ruidos),
          };
        })
      );
    },
    [iddispositivos, periodoAtivo]
  );

  // Mantém referências sempre atualizadas para a assinatura do Realtime usar
  // o período e a função de busca atuais sem precisar se reconectar a cada troca de filtro.
  const carregarLeiturasRef = useRef(carregarLeituras);

  useEffect(() => {
    periodoRef.current = periodoAtivo;
  }, [periodoAtivo]);

  useEffect(() => {
    carregarLeiturasRef.current = carregarLeituras;
  }, [carregarLeituras]);

  // Carrega ao abrir a tela e sempre que trocar de dispositivo ou de período
  useEffect(() => {
    carregarLeituras();
  }, [carregarLeituras]);

  // Enquanto a tela está em foco, recebe cada nova leitura do ESP32 em tempo real
  useFocusEffect(
    useCallback(() => {
      if (!iddispositivos) return undefined;

      const canal = supabase
        .channel(`historico-leituras-${iddispositivos}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'leituradossensores',
            filter: `iddispositivos=eq.${iddispositivos}`,
          },
          (payload) => {
            // "Hoje": acrescenta o ponto novo ao gráfico (e descarta o mais antigo)
            if (periodoRef.current === 'Hoje') {
              setLeituras((atuais) => adicionarLeitura(atuais, payload.new));
              return;
            }

            // 7 e 30 dias: refaz as médias diárias, no máximo uma vez a cada 30 s
            const agora = Date.now();
            if (agora - ultimaAtualizacaoMediasRef.current >= INTERVALO_MIN_ATUALIZAR_MEDIAS_MS) {
              ultimaAtualizacaoMediasRef.current = agora;
              carregarLeiturasRef.current({ silencioso: true });
            }
          }
        )
        .subscribe((status) => {
          console.log('[Realtime] histórico:', status); // pode remover depois de testar

          // Ao (re)conectar, ou ao voltar para a tela, busca os dados de novo
          // para cobrir o que aconteceu enquanto ela estava fora de foco
          if (status === 'SUBSCRIBED') carregarLeiturasRef.current({ silencioso: true });
        });

      return () => {
        supabase.removeChannel(canal);
      };
    }, [iddispositivos])
  );

  // Mostra só alguns rótulos no eixo X para não poluir o gráfico.
  const passoRotulo = periodoAtivo === '30 Dias' ? 5 : periodoAtivo === 'Hoje' ? 4 : 1;
  const labels = leituras.map((l, i) => (i % passoRotulo === 0 ? l.label : ''));

  const sensoresDisponiveis = [
    {
      id: 'luminosidade',
      ...infoSensores.luminosidade,
      data: leituras.map((l) => l.luminosidade),
    },
    {
      id: 'ruido',
      ...infoSensores.ruido,
      data: leituras.map((l) => l.ruidos),
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

        <Text style={styles.sectionTitle}>
          {periodoAtivo === 'Hoje'
            ? 'Últimas leituras de hoje'
            : `Média diária - últimos ${periodoAtivo === '7 Dias' ? '7' : '30'} dias`}
        </Text>

        {erro ? (
          <Text style={{ color: '#E44B4B', fontSize: 13, marginTop: 10 }}>{erro}</Text>
        ) : carregando ? (
          <Text style={{ color: '#8A8A8A', fontSize: 13, marginTop: 10 }}>Carregando...</Text>
        ) : exibirApenasAvisoTemperatura ? (
          <View style={styles.avisoTemperaturaWrapper}>
            <Text style={styles.avisoTemperaturaTexto}>
              Estamos Trabalhando Nessa Função!{'\n'}Em Breve - 2027
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
                  Temperatura: Estamos Trabalhando Nessa Função! Em Breve - 2027
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Rodapé de navegação */}
      <BarraNavegacao
        navigation={navigation}
        abaAtiva="Historico"
      />
    </SafeAreaView>
  );
}