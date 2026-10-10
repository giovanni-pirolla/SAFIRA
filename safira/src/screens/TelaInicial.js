import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import styles from './estilos/TelaInicialEstilos';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { listarDispositivos } from '../services/dispositivoService';
import { buscarUltimaLeitura } from '../services/leiturasService';

function StatusCard({ titulo, valor, unidade, status, progresso, min, max }) {
  const badgeStyle = status === 'Normal' ? styles.badgeNormal : styles.badgeAtencao;
  const badgeTextStyle = status === 'Normal' ? styles.badgeTextNormal : styles.badgeTextAtencao;
  const barColor = status === 'Normal' ? styles.barFillNormal : styles.barFillAtencao;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitulo}>{titulo}</Text>
        <View style={badgeStyle}>
          <Text style={badgeTextStyle}>{status}</Text>
        </View>
      </View>

      <Text style={styles.cardValor}>
        {valor}
        <Text style={styles.cardUnidade}> {unidade}</Text>
      </Text>

      <View style={styles.barBackground}>
        <View style={[barColor, { width: `${progresso}%` }]} />
      </View>

      <View style={styles.barLabels}>
        <Text style={styles.barLabelText}>{min}</Text>
        <Text style={styles.barLabelText}>{max}</Text>
      </View>
    </View>
  );
}

function calcularProgressoSom(valor, limites) {
  if (!limites) return { progresso: 0, status: 'Normal', max: 70 };

  const { confortavel_ate, desconforto_a_partir } = limites;
  const max = desconforto_a_partir ?? confortavel_ate * 1.5;

  const status = valor >= desconforto_a_partir || valor > confortavel_ate ? 'Atenção' : 'Normal';
  const progresso = Math.min(100, Math.max(0, (valor / max) * 100));

  return { progresso, status, max: Math.round(max) };
}

function calcularProgressoLuz(valor, limites) {
  if (!limites) return { progresso: 0, status: 'Normal', max: 700 };

  const { confortavel_de, confortavel_ate, desconforto_a_partir } = limites;

  // Fallback: quando o registro não possui "desconforto_a_partir" definido,
  // assumimos um teto proporcional à largura da própria faixa confortável.
  const larguraConfortavel = confortavel_ate - confortavel_de;
  const max = desconforto_a_partir ?? confortavel_ate + larguraConfortavel;

  const status = valor < confortavel_de || valor > confortavel_ate ? 'Atenção' : 'Normal';
  const progresso = Math.min(100, Math.max(0, (valor / max) * 100));

  return { progresso, status, max: Math.round(max) };
}

export default function TelaInicial({ navigation }) {
  const { session } = useAuth();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [luminosidade, setLuminosidade] = useState(null);
  const [ruido, setRuido] = useState(null);
  const [limitesSom, setLimitesSom] = useState(null);
  const [limitesLuz, setLimitesLuz] = useState(null);

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

    const iddispositivos = dispositivos[0].iddispositivos;

    const { data: leitura, error: leituraError } = await buscarUltimaLeitura(iddispositivos);

    if (leituraError) {
      setErro('Não foi possível carregar a leitura mais recente.');
      setCarregando(false);
      return;
    }

    setLuminosidade(leitura?.luminosidade ?? null);
    setRuido(leitura?.ruidos ?? null);
    setCarregando(false);
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const infoSom = calcularProgressoSom(ruido ?? 0, limitesSom);
  const infoLuz = calcularProgressoLuz(luminosidade ?? 0, limitesLuz);

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
        >
          <Image style={styles.notificationIcon} source={require('../../fotos/icon-bell.png')} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.greeting}>Bom Dia? Como está{'\n'}o ambiente agora?</Text>

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
            />

            <StatusCard
              titulo="Ruído"
              valor={ruido ?? '--'}
              unidade="dB"
              status={infoSom.status}
              progresso={infoSom.progresso}
              min={0}
              max={infoSom.max}
            />

            {/*
              Barra de Temperatura desativada temporariamente.
              O ESP32 ainda não coleta dados reais de temperatura.
              Reativar quando a coleta estiver disponível.

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

        <TouchableOpacity style={styles.adjustButton}>
          <Text style={styles.adjustButtonText}>Ajustar Limites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('Historico')}
        >
          <Text style={styles.historyButtonText}>Ver Histórico</Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé de navegação */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItem}>
          <Text style={[styles.bottomText, styles.bottomTextActive]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate('Historico')}
        >
          <Text style={styles.bottomText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate('Dispositivos')}
        >
          <Text style={styles.bottomText}>Dispositivos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}