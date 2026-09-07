import React from 'react';
import { View, Text, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/DispositivosEstilos';

function DispositivoCard({ nome, ambiente, status, bateria, atualizado }) {
  const ativo = status === 'Ativo';
  const badgeStyle = ativo ? styles.badgeAtivo : styles.badgeInativo;
  const badgeTextStyle = ativo ? styles.badgeTextAtivo : styles.badgeTextInativo;
  const bateriaCor = bateria > 20 ? styles.bateriaAlta : styles.bateriaBaixa;

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconeQuadrado}>
        <Text style={styles.iconeEmoji}>🪪</Text>
      </View>

      <View style={styles.cardConteudo}>
        <View style={styles.nomeLinha}>
          <Text style={styles.nomeTexto}>{nome}</Text>
          <Text style={styles.editarIcone}>✎</Text>
        </View>

        <Text style={styles.ambienteTexto}>{ambiente}</Text>

        <View style={styles.infoLinha}>
          <View style={styles.bateriaWrapper}>
            <View style={styles.bateriaBase}>
              <View style={[styles.bateriaPreenchimento, bateriaCor, { width: `${bateria}%` }]} />
            </View>
            <Text style={styles.bateriaTexto}>{bateria}%</Text>
          </View>
          <Text style={styles.pontoSeparador}>•</Text>
          <Text style={styles.atualizadoTexto}>{atualizado}</Text>
        </View>
      </View>

      <View style={styles.ladoDireito}>
        <View style={badgeStyle}>
          <Text style={badgeTextStyle}>{status}</Text>
        </View>
        <Text style={styles.setaTexto}>{'>'}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Dispositivos({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dispositivos</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <DispositivoCard
          nome="Crachá SAFIRA 01"
          ambiente="Todos os ambientes"
          status="Ativo"
          bateria={78}
          atualizado="Atualizado agora"
        />

        <DispositivoCard
          nome="Crachá SAFIRA 02"
          ambiente="Escola"
          status="Inativo"
          bateria={10}
          atualizado="Atualizado há 1 dia(s)"
        />
      </ScrollView>

      {/* Botão flutuante de adicionar dispositivo */}
      <Pressable style={styles.fab}
      onPress={() => navigation.navigate('AddDispositivo')}
      >
        <Text style={styles.fabTexto}>+</Text>
      </Pressable>

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
        <TouchableOpacity style={styles.bottomItem}
        onPress={() => navigation.navigate('Perfil')}
        >
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}