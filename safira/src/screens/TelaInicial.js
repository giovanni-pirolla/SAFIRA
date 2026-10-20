import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './estilos/TelaInicialEstilos';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { listarDispositivos } from '../services/dispositivosService';
import { buscarUltimaLeitura } from '../services/leiturasService';
import BarraNavegacao from '../components/BarraNavegacao';

const ESTILOS_STATUS = {
  Confortável: {
    badge: styles.badgeConfortavel,
    badgeText: styles.badgeTextConfortavel,
    bar: styles.barFillConfortavel, // azul
  },
  Atenção: {
    badge: styles.badgeAtencao,
    badgeText: styles.badgeTextAtencao,
    bar: styles.barFillAtencao, // amarelo
  },
  Alerta: {
    badge: styles.badgeAlerta,
    badgeText: styles.badgeTextAlerta,
    bar: styles.barFillAlerta, // vermelho
  },
};

const DURACAO_ANIMACAO_MS = 600;

// Colunas "numeric" podem chegar como texto; converte para número e mantém null se não houver valor
const paraNumero = (valor) => (valor === null || valor === undefined ? null : Number(valor));

// Ordem e cores usadas na transição animada da barra (mesma ordem nos dois arrays)
const STATUS_ORDEM = ['Confortável', 'Atenção', 'Alerta'];
const COR_BARRA = ['#2F6FED', '#F2A93B', '#E44B4B'];

// ---------- Ícones (feitos só com View, sem imagens) ----------

const ANGULOS_RAIOS = [0, 45, 90, 135, 180, 225, 270, 315];
const ALTURAS_ONDAS = [10, 18, 28, 18, 24, 12];

function IconeSol() {
  return (
    <View style={styles.solContainer}>
      {ANGULOS_RAIOS.map((angulo) => (
        <View
          key={angulo}
          style={[styles.solRaioWrapper, { transform: [{ rotate: `${angulo}deg` }] }]}
        >
          <View style={styles.solRaio} />
        </View>
      ))}
      <View style={styles.solCentro} />
    </View>
  );
}

function IconeSom() {
  return (
    <View style={styles.somContainer}>
      {ALTURAS_ONDAS.map((altura, i) => (
        <View key={i} style={[styles.somBarra, { height: altura }]} />
      ))}
    </View>
  );
}

// ---------- Card de status ----------

function StatusCard({ titulo, valor, unidade, status, progresso, min, max, icone, iconeFundo }) {
  const estilo = ESTILOS_STATUS[status] ?? ESTILOS_STATUS.Confortável;

  const indiceStatus = Math.max(0, STATUS_ORDEM.indexOf(status));
  const progressoAnim = useRef(new Animated.Value(0)).current;
  const corAnim = useRef(new Animated.Value(indiceStatus)).current;

  // Anima a largura da barra sempre que o progresso mudar
  useEffect(() => {
    Animated.timing(progressoAnim, {
      toValue: progresso,
      duration: DURACAO_ANIMACAO_MS,
      useNativeDriver: false, // largura e cor não rodam no driver nativo
    }).start();
  }, [progresso, progressoAnim]);

  // Anima a cor da barra quando o status mudar (azul → amarelo → vermelho)
  useEffect(() => {
    Animated.timing(corAnim, {
      toValue: indiceStatus,
      duration: DURACAO_ANIMACAO_MS,
      useNativeDriver: false,
    }).start();
  }, [indiceStatus, corAnim]);

  const larguraBarra = progressoAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const corBarra = corAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: COR_BARRA,
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={[styles.iconCircle, { backgroundColor: iconeFundo }]}>{icone}</View>

        <View style={styles.cardConteudo}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitulo}>{titulo}</Text>
            <View style={estilo.badge}>
              <Text style={estilo.badgeText}>{status}</Text>
            </View>
          </View>

          <Text style={styles.cardValor}>
            {valor}
            <Text style={styles.cardUnidade}> {unidade}</Text>
          </Text>

          <View style={styles.barBackground}>
            <Animated.View
              style={[estilo.bar, { width: larguraBarra, backgroundColor: corBarra }]}
            />
          </View>

          <View style={styles.barLabels}>
            <Text style={styles.barLabelText}>{min}</Text>
            <Text style={styles.barLabelText}>{max}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Lê um limite vindo do banco (pode ser número, texto ou ausente)
function lerLimite(valor) {
  if (valor === null || valor === undefined || valor === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

// Barra vai de 0 até "max". Passou do limite = barra cheia (100%).
function calcularProgresso(valor, max) {
  if (!max || max <= 0) return 0;
  return Math.min(100, Math.max(0, (valor / max) * 100));
}

/**
 * Faixas de status:
 *  - Confortável: até "confortavel_ate"
 *  - Atenção:     entre "confortavel_ate" e "desconforto_a_partir"
 *  - Alerta:      acima de "desconforto_a_partir" (ou abaixo de "confortavel_de", se existir)
 *
 * A faixa de Atenção só existe quando "desconforto_a_partir" está definido e é maior que
 * "confortavel_ate". Sem ele, passou de "confortavel_ate" já é Alerta.
 */
function classificarStatusGeral(valor, { de, ate, desconforto }) {
  const limiteAlertaMax = desconforto ?? ate;
  
  if (limiteAlertaMax !== null && valor > limiteAlertaMax) return 'Alerta';
  if (de !== null && valor < de) return 'Alerta';

  // Se houver uma faixa de atenção configurada (ex: entre 'ate' e 'desconforto')
  if (desconforto !== null && ate !== null && valor > ate && valor <= desconforto) {
    return 'Atenção';
  }

  return 'Confortável';
}

function classificarStatusLuz(valor, { de, ate }) {
  if (de === null || ate === null) return 'Confortável';

  if (valor > ate) {
    return 'Alerta';
  }

  if (valor > de && valor < ate) {
    return 'Atenção';
  }

  // Dentro da faixa confortável
  return 'Confortável';
}

function calcularProgressoSom(valor, limites) {
  const ate = lerLimite(limites?.confortavel_ate);
  const desconforto = lerLimite(limites?.desconforto_a_partir);
  const max = desconforto ?? (ate ? ate * 1.3 : 70);

  if (!max) return { progresso: 0, status: 'Confortável', max: 70 };

  const status = classificarStatusGeral(valor, { de: null, ate, desconforto });
  return { progresso: calcularProgresso(valor, max), status, max: Math.round(max) };
}

function calcularProgressoLuz(valor, limites) {
  const de = lerLimite(limites?.confortavel_de);
  const ate = lerLimite(limites?.confortavel_ate);

  if (!Number.isFinite(valor) || de === null || ate === null || de > ate) {
    return {
      progresso: 0,
      status: 'Confortável',
      max: 500,
    };
  }

  // Utiliza a lógica de classificação baseada nos limites de luz
  const status = classificarStatusLuz(valor, { de, ate });

  // O limite máximo da barra (max) pode ser o próprio 'ate' definido pelo usuário
  const maxBarra = ate;

  return {
    progresso: calcularProgresso(valor, maxBarra),
    status,
    max: Math.round(maxBarra),
  };
}

export default function TelaInicial({ navigation }) {
  const { session } = useAuth();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [luminosidade, setLuminosidade] = useState(null);
  const [ruido, setRuido] = useState(null);
  const [limitesSom, setLimitesSom] = useState(null);
  const [limitesLuz, setLimitesLuz] = useState(null);

  const [iddispositivo, setIddispositivo] = useState(null);

  // Busca a leitura mais recente e atualiza luminosidade e ruído
  const atualizarUltimaLeitura = useCallback(async (id) => {
    const { data: leitura, error: leituraError } = await buscarUltimaLeitura(id);

    if (leituraError) return false;

    setLuminosidade(paraNumero(leitura?.luminosidade));
    setRuido(paraNumero(leitura?.ruidos));
    return true;
  }, []);

  // Carga inicial: limites do usuário, dispositivo e última leitura
  const carregarDados = useCallback(async () => {
    const idusuario = session?.user?.id;

    if (!idusuario) {
      setErro('Usuário não autenticado.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro('');

    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuario')
      .select('limites_som, limites_luz')
      .eq('id', idusuario)
      .single();

    if (usuarioError) {
      setErro('Não foi possível carregar seus limites de conforto.');
      setCarregando(false);
      return;
    }

    setLimitesSom(usuarioData?.limites_som ?? null);
    setLimitesLuz(usuarioData?.limites_luz ?? null);

    const { data: dispositivos, error: dispositivosError } = await listarDispositivos();

    if (dispositivosError || !dispositivos || dispositivos.length === 0) {
      setErro('Nenhum dispositivo encontrado para este usuário.');
      setCarregando(false);
      return;
    }

    const id = dispositivos[0].iddispositivos;
    const ok = await atualizarUltimaLeitura(id);

    if (!ok) {
      setErro('Não foi possível carregar a leitura mais recente.');
      setCarregando(false);
      return;
    }

    setIddispositivo(id); // libera a assinatura do Realtime abaixo
    setCarregando(false);
  }, [session?.user?.id, atualizarUltimaLeitura]);

  // Ao entrar na tela, recarrega limites e leitura (ex.: depois de ajustar limites no Perfil)
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  // Enquanto a tela está em foco, recebe cada nova leitura do ESP32 em tempo real
  useFocusEffect(
    useCallback(() => {
      if (!iddispositivo) return undefined;

      const canal = supabase
        .channel(`leituras-dispositivo-${iddispositivo}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'leituradossensores',
            filter: `iddispositivos=eq.${iddispositivo}`,
          },
          (payload) => {
            setLuminosidade(paraNumero(payload.new?.luminosidade));
            setRuido(paraNumero(payload.new?.ruidos));
          }
        )
        .subscribe((status) => {
          console.log('[Realtime] leituras:', status); // pode remover depois de testar

          // Ao (re)conectar, busca a última leitura para cobrir o que passou durante uma queda
          if (status === 'SUBSCRIBED') atualizarUltimaLeitura(iddispositivo);
        });

      return () => {
        supabase.removeChannel(canal);
      };
    }, [iddispositivo, atualizarUltimaLeitura])
  );

  const infoSom = calcularProgressoSom(ruido ?? 0, limitesSom);
  const infoLuz = calcularProgressoLuz(luminosidade ?? 0, limitesLuz);

  // Depuração temporária: mostra no terminal o que está sendo comparado (pode remover depois

  const horaAtual = new Date().getHours();

  let mensagem = '';

  if (horaAtual >= 5 && horaAtual < 12){
    mensagem = 'Bom Dia! Como está o ambiente agora?';
  } else if (horaAtual >= 12 && horaAtual < 18) {
    mensagem = 'Boa Tarde! Como está o ambiente agora?';
  } else {
    mensagem = 'Boa Noite! Como está o ambiente agora?';
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Image
            source={require('../../fotos/logoSafira2.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Alerts')}
          accessibilityRole="button"
          accessibilityLabel="Abrir alertas"
        >
          <Ionicons
            name="notifications-outline"
            size={34}
            color="#1E3A8A"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.greeting}>{mensagem}</Text>

        {erro ? (
          <Text style={{ color: '#E44B4B', fontSize: 13, marginTop: 10 }}>{erro}</Text>
        ) : carregando ? (
          <Text style={{ color: '#8A8A8A', fontSize: 13, marginTop: 10 }}>Carregando...</Text>
        ) : (
          <>
            <StatusCard
              titulo="Luminosidade"
              valor={luminosidade ?? '--'}
              unidade="lx"
              status={infoLuz.status}
              progresso={infoLuz.progresso}
              min={0}
              max={infoLuz.max}
              icone={<IconeSol />}
              iconeFundo="#FDEBCB"
            />

            <StatusCard
              titulo="Ruído"
              valor={ruido ?? '--'}
              unidade="dB"
              status={infoSom.status}
              progresso={infoSom.progresso}
              min={0}
              max={infoSom.max}
              icone={<IconeSom />}
              iconeFundo="#DCE9FB"
            />

            {/*
              Barra de Temperatura desativada temporariamente.
              O ESP32 ainda não coleta dados reais de temperatura.
              Reativar quando a coleta estiver disponível
              (lembre de passar icone e iconeFundo).

              <StatusCard
                titulo="Temperatura"
                valor="24,2"
                unidade="°C"
                status="Normal"
                progresso={69}
                min={0}
                max={35}
              />
            */}
          </>
        )}

        <TouchableOpacity style={styles.adjustButton} onPress={() => navigation.navigate('Perfil')}>
          <Ionicons name="options" size={20} color="#1B1B1B" style={styles.buttonIcon} />
          <Text style={styles.adjustButtonText}>Ajustar Limites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('Historico')}
        >
          <MaterialCommunityIcons
            name="chart-line"
            size={20}
            color="#2F6FED"
            style={styles.buttonIcon}
          />
          <Text style={styles.historyButtonText}>Ver Histórico</Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé de navegação */}
      <BarraNavegacao
        navigation={navigation}
        abaAtiva="Inicio"
      />
    </SafeAreaView>
  );
}