import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import { logout } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import styles from './estilos/PerfilEstilos';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import BarraNavegacao from '../components/BarraNavegacao';

function ResumoCard({
  icone,
  tipoIcone = 'ionicons',
  corFundo,
  corIcone,
  valor,
  label,
  tamanhoIcone = 27,
}) {
  return (
    <View style={styles.resumoCard}>
      <View style={[styles.resumoIconeCircle, { backgroundColor: corFundo }]}>
        {tipoIcone === 'fontawesome5' ? (
          <FontAwesome5 name={icone} size={tamanhoIcone} color={corIcone} />
        ) : (
          <Ionicons name={icone} size={tamanhoIcone} color={corIcone} />
        )}
      </View>
      <Text style={styles.resumoValor}>{valor}</Text>
      <Text style={styles.resumoLabel}>{label}</Text>
    </View>
  );
}

// Componente atualizado usando ícones do Expo em vez de imagens PNG
function BarraFaixaSensorial({
  iconeComponente,
  corIcone,
  titulo,
  recomendado,
  min = 0,
  max,
  ponto1,
  ponto2,
  semDados = false,
}) {
  if (semDados) {
    return (
      <View style={styles.limiteCard}>
        <View style={styles.limiteHeader}>
          <View style={[styles.limiteIconeCircle, { backgroundColor: corIcone }]}>
            {iconeComponente}
          </View>
          <View style={styles.limiteTextos}>
            <Text style={styles.limiteTitulo}>{titulo}</Text>
            <Text style={styles.limiteRecomendado}>{recomendado}</Text>
          </View>
        </View>

        <View style={styles.trilhaCinza}>
          <Text style={styles.textoSemDados}>Sem dados para exibir</Text>
        </View>
      </View>
    );
  }

  const p1 = Math.min(Math.max(Number(ponto1) || 0, min), max);
  const p2 = Math.min(Math.max(Number(ponto2) || p1, p1), max);

  const pctAzul = Math.max(0, ((p1 - min) / (max - min)) * 100);
  const pctAmarelo = Math.max(0, ((p2 - p1) / (max - min)) * 100);
  const pctVermelho = Math.max(0, 100 - pctAzul - pctAmarelo);

  // Divide o valor máximo em 4 partes iguais para os rótulos abaixo da barra
  const passo = (max - min) / 4;
  const rotulo0 = min;
  const rotulo1 = Math.round(min + passo);
  const rotulo2 = Math.round(min + passo * 2);
  const rotulo3 = Math.round(min + passo * 3);
  const rotulo4 = max;

  return (
    <View style={styles.limiteCard}>
      <View style={styles.limiteHeader}>
        <View style={[styles.limiteIconeCircle, { backgroundColor: corIcone }]}>
          {iconeComponente}
        </View>

        <View style={styles.limiteTextos}>
          <Text style={styles.limiteTitulo}>{titulo}</Text>
          <Text style={styles.limiteRecomendado}>{recomendado}</Text>
        </View>
      </View>

      {/* Barra Tricolor */}
      <View style={styles.trilhaContainer}>
        {pctAzul > 0 && <View style={[styles.faixaAzul, { width: `${pctAzul}%` }]} />}
        {pctAmarelo > 0 && <View style={[styles.faixaAmarela, { width: `${pctAmarelo}%` }]} />}
        {pctVermelho > 0 && <View style={[styles.faixaVermelha, { width: `${pctVermelho}%` }]} />}
      </View>

      {/* Rótulos divididos uniformemente em 4 partes */}
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabelText}>{rotulo0}</Text>
        <Text style={styles.sliderLabelText}>{rotulo1}</Text>
        <Text style={styles.sliderLabelText}>{rotulo2}</Text>
        <Text style={styles.sliderLabelText}>{rotulo3}</Text>
        <Text style={styles.sliderLabelText}>{rotulo4}</Text>
      </View>

      {/* Legenda Explicativa */}
      <View style={styles.legendaContainer}>
        <View style={styles.legendaItem}>
          <View style={[styles.legendaBolinha, { backgroundColor: '#2F6FED' }]} />
          <Text style={styles.legendaTexto}>Confortável</Text>
        </View>

        <View style={styles.legendaItem}>
          <View style={[styles.legendaBolinha, { backgroundColor: '#F2A93B' }]} />
          <Text style={styles.legendaTexto}>Atenção</Text>
        </View>

        <View style={styles.legendaItem}>
          <View style={[styles.legendaBolinha, { backgroundColor: '#E44B4B' }]} />
          <Text style={styles.legendaTexto}>Alerta</Text>
        </View>
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
  const [carregando, setCarregando] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { session } = useAuth();

  const carregarPerfil = useCallback(async () => {
    setCarregando(true);

    try {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      const idusuario = userData?.user?.id;
      if (!idusuario) return;

      const { data: perfil, error: perfilError } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', idusuario)
        .single();

      if (perfilError) throw perfilError;
      setUsuario(perfil);

      const { data: dispositivos, count: qtdDispositivos, error: dispositivosError } =
        await supabase
          .from('dispositivos')
          .select('iddispositivos', { count: 'exact' })
          .eq('idusuario', idusuario);

      if (dispositivosError) throw dispositivosError;
      setTotalDispositivos(qtdDispositivos ?? 0);

      if (!dispositivos?.length) return;

      const idsDispositivos = dispositivos.map((d) => d.iddispositivos);

      const { count: qtdLeituras, error: leiturasError } = await supabase
        .from('leituradossensores')
        .select('*', { count: 'exact', head: true })
        .in('iddispositivos', idsDispositivos);

      if (leiturasError) throw leiturasError;
      setTotalLeituras(qtdLeituras ?? 0);

      const { data: primeiraLeitura } = await supabase
        .from('leituradossensores')
        .select('data_hora')
        .in('iddispositivos', idsDispositivos)
        .order('data_hora', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (primeiraLeitura?.data_hora) {
        const diffMs = Date.now() - new Date(primeiraLeitura.data_hora).getTime();
        setDiasDeUso(Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24))));
      }

      const inicioHoje = new Date();
      inicioHoje.setHours(0, 0, 0, 0);

      const { data: leiturasHoje } = await supabase
        .from('leituradossensores')
        .select('ruidos, luminosidade')
        .in('iddispositivos', idsDispositivos)
        .gte('data_hora', inicioHoje.toISOString());

      const limSom = perfil?.limites_som || {};
      const limLuz = perfil?.limites_luz || {};

      const somAte = Number(limSom.confortavel_ate) || 55;
      const somDesconforto = Number(limSom.desconforto_a_partir) || 70;
      const luzAte = Number(limLuz.confortavel_ate) || 500;

      const contadorAlertas = (leiturasHoje || []).filter((l) => {
        const r = Number(l.ruidos);
        const luz = Number(l.luminosidade);
        return (r != null && r >= somDesconforto) || (luz != null && luz >= luzAte);
      }).length;

      setAlertasHoje(contadorAlertas);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  const handleSair = async () => {
    await logout();
  };

  const uploadImage = async (asset, currentSession) => {
    const userId = currentSession?.user?.id;
    if (!userId || !asset?.base64) return;

    setUploading(true);
    try {
      const arrayBuffer = decode(asset.base64);
      const filePath = `${userId}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const imageUrl = `${urlData?.publicUrl}?t=${Date.now()}`;

      await supabase.from('usuario').update({ avatar_url: imageUrl }).eq('id', userId);
      setUsuario((prev) => ({ ...prev, avatar_url: imageUrl }));
      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    } catch (error) {
      Alert.alert('Erro', error?.message || 'Erro ao atualizar foto.');
    } finally {
      setUploading(false);
    }
  };

  const selecionarOrigemFoto = () => {
    Alert.alert('Alterar Foto de Perfil', 'Escolha uma opção:', [
      { text: 'Tirar Foto (Câmera)', onPress: tirarFotoCamera },
      { text: 'Escolher da Galeria', onPress: escolherFotoGaleria },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const tirarFotoCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) await uploadImage(result.assets[0], session);
  };

  const escolherFotoGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) await uploadImage(result.assets[0], session);
  };

  const limLuz = usuario?.limites_luz ?? {};
  const limSom = usuario?.limites_som ?? {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.secaoTitulo}>Definições do Perfil</Text>

        <View style={styles.userCard}>
          <Pressable onPress={selecionarOrigemFoto} style={styles.avatarCircle}>
            {uploading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : usuario?.avatar_url ? (
              <Image source={{ uri: usuario.avatar_url }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-outline" size={28} color="#5A5A5A" />
            )}
          </Pressable>

          <View style={styles.userInfo}>
            <Text style={styles.userNome}>
              {usuario?.nome ?? (carregando ? 'Carregando...' : '—')}
            </Text>
            <Text style={styles.userEmail}>{usuario?.email ?? ''}</Text>
            <View style={styles.contaAtivaBadge}>
              <Text style={styles.contaAtivaTexto}>Conta Ativa</Text>
            </View>
          </View>

          <Pressable
            style={styles.engrenagemButton}
            onPress={() => navigation.navigate('Configuracao')}
          >
            <Ionicons name="settings-outline" size={24} color="#5A5A5A" />
          </Pressable>
        </View>

        <Text style={styles.secaoTitulo}>Resumo da Conta</Text>

        <View style={styles.resumoWrapper}>
          <ResumoCard
            icone="id-badge"
            tipoIcone="fontawesome5"
            corFundo="#DFF5E5"
            corIcone="#248A45"
            valor={totalDispositivos}
            label="Dispositivos conectados"
            tamanhoIcone={23}
          />
          <ResumoCard
            icone="shield-checkmark-outline"
            corFundo="#DCEAFB"
            corIcone="#3269B0"
            valor={diasDeUso}
            label="Dias de Uso ativo"
          />
          <ResumoCard
            icone="bar-chart-outline"
            corFundo="#EDE1FB"
            corIcone="#8251B5"
            valor={totalLeituras}
            label="Registros leituras"
          />
          <ResumoCard
            icone="warning-outline"
            corFundo="#FCEBCB"
            corIcone="#C78316"
            valor={alertasHoje}
            label="Alertas hoje"
          />
        </View>

        <Text style={styles.secaoTitulo}>Limites sensoriais definidos</Text>

        {/* Luminosidade: Ícone de Sol */}
        <BarraFaixaSensorial
          iconeComponente={<Ionicons name="sunny-outline" size={22} color="#C78316" />}
          corIcone="#FCEBCB"
          titulo="Luminosidade"
          recomendado={`Confortável: ${limLuz.confortavel_de ?? 200} - ${limLuz.confortavel_ate ?? 500} lux`}
          min={0}
          max={1000}
          ponto1={limLuz.confortavel_de ?? 200}
          ponto2={limLuz.confortavel_ate ?? 500}
        />

        {/* Som: Ícone de Som/Volume */}
        <BarraFaixaSensorial
          iconeComponente={<Ionicons name="volume-medium-outline" size={22} color="#3269B0" />}
          corIcone="#DCEAFB"
          titulo="Ruído"
          recomendado={`Confortável até: ${limSom.confortavel_ate ?? 55} dB | Alerta a partir de: ${limSom.desconforto_a_partir ?? 70} dB`}
          min={0}
          max={100}
          ponto1={limSom.confortavel_ate ?? 55}
          ponto2={limSom.desconforto_a_partir ?? 70}
        />

        {/* Temperatura: Ícone de Termômetro */}
        <BarraFaixaSensorial
          iconeComponente={<Ionicons name="thermometer-outline" size={22} color="#E44B4B" />}
          corIcone="#FBE0DE"
          titulo="Temperatura"
          recomendado="Sensor de temperatura não implementado"
          semDados={true}
        />

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={22} color="#043288" style={{ marginRight: 8 }} />
          <Text style={styles.infoTexto}>
            Acima ou fora dos valores definidos, o aplicativo indicará o estado de atenção ou alerta.
          </Text>
        </View>

        <TouchableOpacity style={styles.sairBotao} onPress={handleSair}>
          <Text style={styles.sairTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <BarraNavegacao navigation={navigation} abaAtiva="Perfil" />
    </SafeAreaView>
  );
}