import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import styles from './estilos/SplashScreenEstilos';

export default function SplashScreen() {
  const [dotAtivo, setDotAtivo] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setDotAtivo((anterior) => (anterior + 1) % 3);
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <View style={styles.container}>
      {/* Ondas decorativas do topo */}
      <View style={styles.ondaTopoWrapper}>
        <View style={styles.ondaTopoCamada1} />
        <View style={styles.ondaTopoCamada2} />
      </View>

      {/* Conteúdo central */}
      <View style={styles.conteudoCentral}>
        <Image
          source={require('../../fotos/safiraLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.titulo}>SAFIRA</Text>

        <View style={styles.dotsWrapper}>
          <View style={[styles.dot, dotAtivo === 0 && styles.dotAtivo]} />
          <View style={[styles.dot, dotAtivo === 1 && styles.dotAtivo]} />
          <View style={[styles.dot, dotAtivo === 2 && styles.dotAtivo]} />
        </View>
      </View>

      {/* Ondas decorativas do rodapé */}
      <View style={styles.ondaBaseWrapper}>
        <View style={styles.ondaBaseCamada1} />
        <View style={styles.ondaBaseCamada2} />
      </View>
    </View>
  );
}