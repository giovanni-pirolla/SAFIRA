import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/TelaInicialEstilos';

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

export default function TelaInicial({ navigation }) {
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
        <TouchableOpacity style={styles.notificationButton}
        onPress={() => navigation.navigate('Alerts')}
        >
          <Image style={styles.notificationIcon} source={require('../../fotos/icon-bell.png')}/>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.greeting}>Bom Dia? Como está{'\n'}o ambiente agora?</Text>

        <StatusCard
          titulo="Luminosidade"
          valor="310"
          unidade="lx"
          status="Normal"
          progresso={44}
          min={0}
          max={700}
        />

        <StatusCard
          titulo="Ruído"
          valor="42"
          unidade="dB"
          status="Atenção"
          progresso={60}
          min={0}
          max={70}
        />

        <StatusCard
          titulo="Temperatura"
          valor="24,2"
          unidade="°C"
          status="Normal"
          progresso={69}
          min={0}
          max={35}
        />

        <TouchableOpacity style={styles.adjustButton}>
          <Text style={styles.adjustButtonText}>Ajustar Limites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyButton}
        onPress={() => navigation.navigate('Historico')}
        >
          <Text style={styles.historyButtonText}>Ver Histórico</Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé de navegação (visual, sem funcionalidade ainda) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItem}>
          <Text style={[styles.bottomText, styles.bottomTextActive]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}
        onPress={() => navigation.navigate('Historico')}
        >
          <Text style={styles.bottomText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomItem}
        onPress={() => navigation.navigate('Dispositivos')}
        >
          <Text style={styles.bottomText}>Dispositivos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}
        onPress={() => navigation.navigate('Perfil')}
        >
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}