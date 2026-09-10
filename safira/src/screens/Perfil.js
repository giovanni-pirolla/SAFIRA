import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Pressable, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';
import { logout } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import styles from './estilos/PerfilEstilos';
import * as ImagePicker from 'expo-image-picker';

// ... (ResumoCard e LimiteSensorial componentes permanecem os mesmos) ...

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
  const safeMin = Number(min) || 0;
  const safeMax = Number(max) || 1;
  const safeValorAtual = Number(valorAtual) || 0;

  const progresso = safeMax > safeMin ? ((safeValorAtual - safeMin) / (safeMax - safeMin)) * 100 : 0;
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
  const [uploading, setUploading] = useState(false);

  const { session } = useAuth(); // <--- session obtida aqui

  // Valores padrão para os limites caso não existam no perfil do usuário
  const limitesSomPadrao = {
    confortavel_ate: 50, atencao_de: 51, atencao_ate: 70, desconfortavel_acima: 71,
    texto_confortavel: 'até 50 dB', texto_atencao: '51 - 70 dB', texto_desconfortavel: 'acima de 70 dB'
  };
  const limitesLuzPadrao = {
    confortavel_ate: 300, atencao_de: 301, atencao_ate: 700, desconfortavel_acima: 701,
    texto_confortavel: 'até 300 lux', texto_atencao: '301 - 700 lux', texto_desconfortavel: 'acima de 700 lux'
  };

  const limitesSom = usuario?.limites_som || limitesSomPadrao;
  const limitesLuz = usuario?.limites_luz || limitesLuzPadrao;

  // Valores de referência para a barra de progresso (pode ajustar a lógica)
  const valorAtualRuido = (limitesSom.atencao_de + limitesSom.atencao_ate) / 2;
  const valorAtualLuminosidade = (limitesLuz.atencao_de + limitesLuz.atencao_ate) / 2;

  const carregarPerfil = useCallback(async () => {
    setCarregando(true);

    const { data: userData } = await supabase.auth.getUser();
    const idusuario = userData?.user?.id;

    if (!idusuario) {
      setCarregando(false);
      return;
    }

    const { data: perfil, error: perfilError } = await supabase
      .from('usuario')
      .select('*')
      .eq('id', idusuario)
      .single();

    if (perfilError) {
      console.error('Erro ao carregar perfil do usuário:', perfilError.message);
      setUsuario(null);
    } else {
      setUsuario(perfil);
    }

    const { data: dispositivos, count: qtdDispositivos, error: dispositivosError } = await supabase
      .from('dispositivos')
      .select('iddispositivos, configuracaododispositivo(*)', { count: 'exact' })
      .eq('idusuario', idusuario);

    if (dispositivosError) {
      console.error('Erro ao carregar dispositivos:', dispositivosError.message);
      setTotalDispositivos(0);
    } else {
      setTotalDispositivos(qtdDispositivos ?? 0);
    }

    if (dispositivos && dispositivos.length > 0) {
      const idsDispositivos = dispositivos.map((d) => d.iddispositivos);

      const { count: qtdLeituras, error: leiturasError } = await supabase
        .from('leituradossensores')
        .select('*', { count: 'exact', head: true })
        .in('iddispositivos', idsDispositivos);

      if (leiturasError) {
        console.error('Erro ao carregar leituras:', leiturasError.message);
        setTotalLeituras(0);
      } else {
        setTotalLeituras(qtdLeituras ?? 0);
      }

      const { data: primeiraLeitura, error: primeiraLeituraError } = await supabase
        .from('leituradossensores')
        .select('data_hora')
        .in('iddispositivos', idsDispositivos)
        .order('data_hora', { ascending: true })
        .limit(1)
        .single();

      if (primeiraLeituraError) {
        console.error('Erro ao carregar primeira leitura:', primeiraLeituraError.message);
        setDiasDeUso(0);
      } else if (primeiraLeitura?.data_hora) {
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

        const { data: leiturasHoje, error: leiturasHojeError } = await supabase
          .from('leituradossensores')
          .select('*')
          .eq('iddispositivos', disp.iddispositivos)
          .gte('data_hora', inicioHoje.toISOString());

        if (leiturasHojeError) {
          console.error('Erro ao carregar leituras de hoje:', leiturasHojeError.message);
          continue;
        }

        leiturasHoje?.forEach((leitura) => {
          if (leitura.ruido > config.max_ruido || leitura.luminosidade > config.max_luminosidade || leitura.temperatura > config.max_temperatura) {
            contadorAlertas++;
          }
        });
      }
      setAlertasHoje(contadorAlertas);

      const { data: configPrincipalData, error: configPrincipalError } = await supabase
        .from('configuracaododispositivo')
        .select('*')
        .eq('iddispositivo', dispositivos[0].iddispositivos)
        .single();

      if (configPrincipalError) {
        console.error('Erro ao carregar configuração principal:', configPrincipalError.message);
        setConfiguracaoPrincipal(null);
      } else {
        setConfiguracaoPrincipal(configPrincipalData);
      }

    } else {
      setTotalLeituras(0);
      setDiasDeUso(0);
      setAlertasHoje(0);
      setConfiguracaoPrincipal(null);
    }

    setCarregando(false);
  }, []);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  const handleSair = async () => {
    await logout();
  };

  // --- Funções para a foto de perfil ---

  const uploadImage = async (uri, currentSession) => {
    if (!currentSession?.user?.id) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    setUploading(true);

    try {
      // 1. Obtém os dados da imagem
      const response = await fetch(uri);

      if (!response.ok) {
        throw new Error(
          `Não foi possível acessar a imagem. Status: ${response.status}`
        );
      }

      const arrayBuffer = await response.arrayBuffer();

      // 2. Descobre o tipo da imagem
      const contentType =
        response.headers.get('content-type') || 'image/jpeg';

      let fileExt = 'jpg';

      if (contentType === 'image/png') {
        fileExt = 'png';
      } else if (contentType === 'image/webp') {
        fileExt = 'webp';
      } else if (contentType === 'image/jpeg') {
        fileExt = 'jpg';
      }

      console.log('==============================');
      console.log('UPLOAD DA IMAGEM');
      console.log('URI:', uri);
      console.log('Tipo MIME:', contentType);
      console.log('Tamanho:', arrayBuffer.byteLength);
      console.log('Extensão:', fileExt);

      // 3. Cria o caminho dentro do bucket
      const filePath = `${currentSession.user.id}.${fileExt}`;

      console.log('Caminho no Storage:', filePath);

      // 4. Envia para o Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload realizado com sucesso!');

      // 5. Obtém a URL pública
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error(
          'Não foi possível obter a URL pública da imagem.'
        );
      }

      // Evita que o navegador reutilize uma imagem antiga do cache
      const imageUrl = `${publicUrl}?t=${Date.now()}`;

      console.log('URL pública:', imageUrl);

      // 6. Salva a URL no banco
      const { error: updateError } = await supabase
        .from('usuario')
        .update({
          avatar_url: imageUrl,
        })
        .eq('id', currentSession.user.id);

      if (updateError) {
        console.error(
          'Erro ao salvar avatar_url:',
          updateError
        );
        throw updateError;
      }

      // 7. Atualiza a interface imediatamente
      setUsuario((prev) => ({
        ...prev,
        avatar_url: imageUrl,
      }));

      console.log('Avatar salvo no banco com sucesso.');
      console.log('==============================');

      Alert.alert(
        'Sucesso',
        'Foto de perfil atualizada!'
      );

    } catch (error) {
      console.error('==============================');
      console.error('ERRO NO UPLOAD DA IMAGEM');
      console.error(error);
      console.error('Mensagem:', error?.message);
      console.error('==============================');

      Alert.alert(
        'Erro',
        error?.message ||
          'Não foi possível atualizar a foto de perfil.'
      );

    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria para definir a foto de perfil.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImage(uri, session);
    }
  };
  // --- Fim das funções para a foto de perfil ---

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
          <Pressable onPress={pickImage} style={styles.avatarCircle}>
            {uploading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : usuario?.avatar_url ? (
                <Image source={{ uri: usuario.avatar_url }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarIcone}>👤</Text>
              )}
          </Pressable>

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
          recomendado={`Recomendado: ${limitesLuz.texto_confortavel} - ${limitesLuz.texto_atencao}`}
          valorAtual={valorAtualLuminosidade}
          min={limitesLuz.confortavel_ate}
          max={limitesLuz.desconfortavel_acima}
          corBarra="#F2A93B"
        />

        <LimiteSensorial
          emoji="🔊"
          corIcone="#DCEAFB"
          titulo="Ruído"
          recomendado={`Recomendado: ${limitesSom.texto_confortavel} - ${limitesSom.texto_atencao}`}
          valorAtual={valorAtualRuido}
          min={limitesSom.confortavel_ate}
          max={limitesSom.desconfortavel_acima}
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