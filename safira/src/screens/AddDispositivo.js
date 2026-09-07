import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/AddDispositivoEstilos';

export default function AddDispositivo({ navigation }) {
  const rotacao = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotacao, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotacaoInterpolada = rotacao.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Dispositivos</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Stepper */}
      <View style={styles.stepsWrapper}>
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepCircleAtivo]}>
            <Text style={styles.stepNumero}>1</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelAtivo]}>Conectar</Text>
        </View>

        <View style={styles.stepLine} />

        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepCircleInativo]}>
            <Text style={styles.stepNumero}>2</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelInativo]}>Identificar</Text>
        </View>

        <View style={styles.stepLine} />

        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepCircleInativo]}>
            <Text style={styles.stepNumero}>3</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelInativo]}>Concluir</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Ilustração do crachá */}
        <View style={styles.ilustracaoWrapper}>
          <View style={styles.glow} />
          <View style={styles.argola} />
          <View style={styles.crachaBox}>
            <Text style={styles.crachaIcone}>(({'\u2022'}{'\u2022'}))</Text>
          </View>
          <View style={styles.bluetoothCircle}>
            <Image
              source={require('../../fotos/bluetooth-8.png')}
              style={styles.bluetoothIcone}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text style={styles.titulo}>Conecte seu crachá</Text>
        <Text style={styles.descricao}>
          Ative o bluetooth de seu celular e ligue seu crachá{'\n'}para começar a busca.
        </Text>

        {/* Caixa de aviso azul */}
        <View style={styles.avisoBox}>
          <View style={styles.avisoIconeCircle}>
            <Text style={styles.avisoIconeTexto}>i</Text>
          </View>
          <View style={styles.avisoConteudo}>
            <Text style={styles.avisoTitulo}>Como colocar o crachá em modo de pareamento:</Text>
            <Text style={styles.avisoTexto}>
              Pressione e segure o botão do crachá por 5 segundos até os LEDs piscarem.
            </Text>
          </View>
        </View>

        {/* Buscando dispositivos */}
        <View style={styles.buscandoWrapper}>
          <Animated.View
            style={[styles.spinnerCircle, { transform: [{ rotate: rotacaoInterpolada }] }]}
          />
          <Text style={styles.buscandoTexto}>Buscando Dispositivos...</Text>
        </View>
      </View>

      {/* Rodapé de navegação */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItem} onPress={() => navigation.navigate('TelaInicial')}>
          <Text style={styles.bottomText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem} onPress={() => navigation.navigate('Historico')}>
          <Text style={styles.bottomText}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}>
          <Text style={[styles.bottomText, styles.bottomTextActive]}>Dispositivos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}>
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}