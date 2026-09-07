import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';
import { logout } from '../services/authService';
import styles from './estilos/PerfilEstilos';

function ResumoCard({ emoji, corFundo, valor, label }) {
  return (
    <View style={styles.resumoCard}>
      <View style={[styles.resumoIconeCircle, { backgroundColor: corFundo }]}>
        <Text style={styles.resumoIconeTexto}>{emoji}</Text>
      </View>
      <Text style={styles.resumoValor}>{valor}</Text>
      <Text style={styles.resumoLabel}>{label}</Text>
    </View>
  );
}

function LimiteSensorial({ emoji, corIcone, titulo, recomendado, valorAtual, min, max, corBarra }) {
  const progresso = max > min ? ((valorAtual - min) / (max - min)) * 100 : 0;
  const progressoSeguro = Math.max(0, Math.min(100, progresso));

  return (
    <View style={styles.limiteCard}>
      <View style={styles.limiteHeader}>
        <View style={[styles.limiteIconeCircle, { backgroundColor: corIcone }]}>
          <Text style={styles.limiteIconeTexto}>{emoji}</Text>
        </View>
        <View style={styles.limiteTextos}>
          <Text style={styles.limiteTitulo}>{titulo}</Text>
          <Text style={styles.limiteRecomendado}>{recomendado}</Text>
        </View>
      </View>

      <View style={styles.sliderWrapper}>
        <View style={styles.sliderTrilha}>
          <View style={[styles.sliderPreenchido, { width: `${progressoSeguro}%`, backgroundColor: corBarra }]} />
          <View style={[styles.sliderThumb, { left: `${progressoSeguro}%`, borderColor: corBarra }]} />
        </View>
      </View>

      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabelText}>{min}</Text>
        <Text style={styles.sliderLabelText}>{max}</Text>
      </View>
    </View>
  );
}

export default function Perfil({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [totalDispositivos, setTotalDispositivos] = useState(0);
  const [totalLeituras, setTotalLeituras] = useState(0);
  const [alertasHoje, setAlertasHoje] = useState(0);
  const [diasDeUso, setDiasDeUso] = useState(0);
  const [configuracaoPrincipal, setConfiguracaoPrincipal] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregarPerfil = useCallback(async () => {
    setCarregando(true);

    const { data: userData } = await supabase.auth.getUser();
    const idusuario = userData?.user?.id;

    if (!idusuario) {
      setCarregando(false);
      return;
    }

    const { data: perfil } = await supabase
      .from('usuario')
      .select('*')
      .eq('id', idusuario)
      .single();
    setUsuario(perfil);

    const { data: dispositivos, count: qtdDispositivos } = await supabase
      .from('dispositivos')
      .select('iddispositivos, configuracaododispositivo(*)', { count: 'exact' })
      .eq('idusuario', idusuario);

    setTotalDispositivos(qtdDispositivos ?? 0);

    if (dispositivos && dispositivos.length > 0) {
      const idsDispositivos = dispositivos.map((d) => d.iddispositivos);

      const { count: qtdLeituras } = await supabase
        .from('leituradossensores')
        .select('*', { count: 'exact', head: true })
        .in('iddispositivos', idsDispositivos);
      setTotalLeituras(qtdLeituras ?? 0);

      const { data: primeiraLeitura } = await supabase
        .from('leituradossensores')
        .select('data_hora')
        .in('iddispositivos', idsDispositivos)
        .order('data_hora', { ascending: true })
        .limit(1)
        .single();

      if (primeiraLeitura?.data_hora) {
        const diffMs = new Date() - new Date(primeiraLeitura.data_hora);
        const diffDias = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        setDiasDeUso(diffDias);
      }

      const inicioHoje = new Date();
      inicioHoje.setHours(0, 0, 0, 0);

      let contadorAlertas = 0;
      for (const disp of dispositivos) {
        const config = disp.configuracaododispositivo;
        if (!config) continue;

        const { data: leiturasHoje } = await supabase
          .from('leituradossensores')
          .select('*')
          .eq('iddispositivos', disp.iddispositivos)
          .gte('data_hora', inicioHoje.toISOString());

        (leiturasHoje ?? []).forEach((l) => {
          if (
            Number(l.luminosidade) > Number(config.max_luminosidade) ||
            Number(l.temperatura) > Number(config.max_temperatura) ||
            Number(l.ruidos) > Number(config.max_ruidos)
          ) {
            contadorAlertas += 1;
          }
        });
      }
      setAlertasHoje(contadorAlertas);

      const primeiraConfig = dispositivos.find((d) => d.configuracaododispositivo)?.configuracaododispositivo;
      setConfiguracaoPrincipal(primeiraConfig ?? null);
    }

    setCarregando(false);
  }, []);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  async function handleSair() {
    await logout();
    // AuthContext detecta o logout e redireciona automaticamente para Login
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.secaoTitulo}>Definições do Perfil</Text>

        {/* Cartão do usuário */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcone}>👤</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userNome}>{usuario?.nome ?? (carregando ? 'Carregando...' : '—')}</Text>
            <Text style={styles.userEmail}>{usuario?.email ?? ''}</Text>
            <View style={styles.contaAtivaBadge}>
              <Text style={styles.contaAtivaTexto}>Conta Ativa</Text>
            </View>
          </View>

          <Pressable
            style={styles.engrenagemButton}
            onPress={() => navigation.navigate('Configuracao')}
          >
            <Text style={styles.engrenagemIcone}>⚙️</Text>
          </Pressable>
        </View>

        <Text style={styles.secaoTitulo}>Resumo da Conta</Text>

        {/* Resumo da conta */}
        <View style={styles.resumoWrapper}>
          <ResumoCard emoji="📱" corFundo="#DFF5E5" valor={totalDispositivos} label="Dispositivos conectados" />
          <ResumoCard emoji="🛡️" corFundo="#DCEAFB" valor={diasDeUso} label="Dias de Uso ativo" />
          <ResumoCard emoji="📈" corFundo="#EDE1FB" valor={totalLeituras} label="Registros leituras" />
          <ResumoCard emoji="⚠️" corFundo="#FCEBCB" valor={alertasHoje} label="Alertas hoje" />
        </View>

        <Text style={styles.secaoTitulo}>Limites sensoriais definidos</Text>

        <LimiteSensorial
          emoji="☀️"
          corIcone="#FCEBCB"
          titulo="Luminosidade"
          recomendado={`Recomendado: ${configuracaoPrincipal?.max_luminosidade ?? '—'} lx`}
          valorAtual={Number(configuracaoPrincipal?.max_luminosidade ?? 0)}
          min={0}
          max={1000}
          corBarra="#F2A93B"
        />

        <LimiteSensorial
          emoji="🔊"
          corIcone="#DCEAFB"
          titulo="Ruído"
          recomendado={`Recomendado: ${configuracaoPrincipal?.max_ruidos ?? '—'} dB`}
          valorAtual={Number(configuracaoPrincipal?.max_ruidos ?? 0)}
          min={0}
          max={120}
          corBarra="#1B2A4A"
        />

        <LimiteSensorial
          emoji="🌡️"
          corIcone="#FBE0DE"
          titulo="Temperatura"
          recomendado={`Recomendado: ${configuracaoPrincipal?.max_temperatura ?? '—'} °C`}
          valorAtual={Number(configuracaoPrincipal?.max_temperatura ?? 0)}
          min={0}
          max={40}
          corBarra="#E4614B"
        />

        {/* Caixa informativa */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcone}>ⓘ</Text>
          <Text style={styles.infoTexto}>
            Acima ou próximo do valor definido, você receberá um alerta
          </Text>
        </View>

        <TouchableOpacity style={styles.sairBotao} onPress={handleSair}>
          <Text style={styles.sairTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Rodapé de navegação */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItem} onPress={() => navigation.navigate('TelaInicial')}>
          <Text style={styles.bottomText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem} onPress={() => navigation.navigate('Historico')}>
          <Text style={styles.bottomText}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem} onPress={() => navigation.navigate('Dispositivos')}>
          <Text style={styles.bottomText}>Dispositivos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}>
          <Text style={[styles.bottomText, styles.bottomTextActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}