
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

import styles from './estilos/BarraNavegacaoEstilos';

const ABAS = [
  { chave: 'Inicio', rotulo: 'Início', rota: 'TelaInicial' },
  { chave: 'Historico', rotulo: 'Histórico', rota: 'Historico' },
  { chave: 'Dispositivos', rotulo: 'Dispositivos', rota: 'Dispositivos' },
  { chave: 'Perfil', rotulo: 'Perfil', rota: 'Perfil' },
];

function IconeAba({ nome, ativa }) {
  const cor = ativa ? '#2F6FED' : '#8A8A8A';

  switch (nome) {
    case 'Inicio':
      return (
        <Ionicons name="home-outline" size={24} color={cor} />
      );

    case 'Historico':
      return (
        <MaterialCommunityIcons
          name="chart-line"
          size={24}
          color={cor}
        />
      );

    case 'Dispositivos':
      return (
        <FontAwesome5 name="id-badge" size={26} color={cor} />
      );

    case 'Perfil':
      return (
        <Ionicons
          name="person-circle-outline"
          size={26}
          color={cor}
        />
      );

    default:
      return null;
  }
}

export default function BarraNavegacao({ navigation, abaAtiva }) {
  return (
    <View style={styles.bottomBar}>
      {ABAS.map((aba) => {
        const ativa = aba.chave === abaAtiva;

        return (
          <TouchableOpacity
            key={aba.chave}
            style={styles.bottomItem}
            onPress={() => {
              if (!ativa) {
                navigation.navigate(aba.rota);
              }
            }}
            accessibilityRole="button"
            accessibilityLabel={aba.rotulo}
            accessibilityState={{ selected: ativa }}
          >
            <IconeAba nome={aba.chave} ativa={ativa} />

            <Text
              style={[
                styles.bottomText,
                ativa && styles.bottomTextActive,
              ]}
            >
              {aba.rotulo}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
