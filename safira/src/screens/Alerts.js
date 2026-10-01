import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/AlertsEstilos';

function AlertaCard({ tipo, titulo, hora, descricao }) {
  const configPorTipo = {
    aviso: { simbolo: require('../../fotos/icon-aviso.png'), corIcone: styles.iconeAviso, corBolinha: styles.bolinhaAviso },
    perigo: { simbolo: '!', corIcone: styles.iconePerigo, corBolinha: styles.bolinhaPerigo },
    sucesso: { simbolo: '✓', corIcone: styles.iconeSucesso, corBolinha: styles.bolinhaSucesso },
  };

  const { simbolo, corIcone, corBolinha } = configPorTipo[tipo];

  return (
    <View style={styles.card}>
      <View style={corIcone}>
        <Text style={styles.iconeTexto}>{simbolo}</Text>
      </View>

      <View style={styles.cardConteudo}>
        <View style={styles.cardHeaderLinha}>
          <Text style={styles.cardTitulo}>{titulo}</Text>
          <Text style={styles.cardHora}>{hora}</Text>
        </View>
        <Text style={styles.cardDescricao}>{descricao}</Text>
      </View>

      <View style={[styles.bolinha, corBolinha]} />
    </View>
  );
}

export default function Alerts({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alertas</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.secao}>Hoje</Text>

        <AlertaCard
          tipo="aviso"
          titulo="Luminosidade Elevada"
          hora="14:23"
          descricao="A Luminosidade está se aproximando do Limite Definido."
        />

        <AlertaCard
          tipo="perigo"
          titulo="Ruído Alto"
          hora="11:07"
          descricao="Nível de Ruído ultrapassou o Limite Definido."
        />

        <Text style={styles.secao}>Ontem</Text>

        <AlertaCard
          tipo="sucesso"
          titulo="Temperatura Normalizada"
          hora="21:45"
          descricao="Nível de Temperatura voltou para a faixa ideal."
        />

        <AlertaCard
          tipo="perigo"
          titulo="Temperatura Alta"
          hora="21:30"
          descricao="Nível de Temperatura ultrapassou o Limite Definido."
        />
      </ScrollView>

      {/* Rodapé de navegação */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItem}>
          <Text style={styles.bottomText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}>
          <Text style={styles.bottomText}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}>
          <Text style={styles.bottomText}>Dispositivos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}>
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}