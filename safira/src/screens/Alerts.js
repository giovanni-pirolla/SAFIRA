// Alerts.js
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import styles from './estilos/AlertsEstilos';
import { buscarAlertas } from '../services/alertasServices';

function AlertaCard({ tipo, titulo, hora, descricao }) {
  const configPorTipo = {
    aviso: { simbolo: require('../../fotos/icon-aviso.png'), corIcone: styles.iconeAviso, corBolinha: styles.bolinhaAviso },
    perigo: { simbolo: '!', corIcone: styles.iconePerigo, corBolinha: styles.bolinhaPerigo },
    sucesso: { simbolo: '✓', corIcone: styles.iconeSucesso, corBolinha: styles.bolinhaSucesso },
  };

  const { simbolo, corIcone, corBolinha } = configPorTipo[tipo];
  const ehImagem = typeof simbolo !== 'string';

  return (
    <View style={styles.card}>
      <View style={corIcone}>
        {ehImagem ? (
          <Image source={simbolo} style={{ width: 18, height: 18 }} resizeMode="contain" />
        ) : (
          <Text style={styles.iconeTexto}>{simbolo}</Text>
        )}
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
  const [alertasPorDia, setAlertasPorDia] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarAlertas = useCallback(async () => {
    setCarregando(true);
    setErro('');

    const { alertasPorDia: dados, error } = await buscarAlertas();

    if (error) {
      setErro('Não foi possível carregar os alertas.');
      setCarregando(false);
      return;
    }

    setAlertasPorDia(dados);
    setCarregando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarAlertas();
    }, [carregarAlertas])
  );

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
        {erro ? (
          <Text style={{ color: '#E44B4B', fontSize: 13, marginTop: 10 }}>{erro}</Text>
        ) : carregando ? (
          <Text style={{ color: '#8A8A8A', fontSize: 13, marginTop: 10 }}>Carregando...</Text>
        ) : alertasPorDia.length === 0 ? (
          <Text style={{ color: '#8A8A8A', fontSize: 13, marginTop: 10 }}>
            Nenhum alerta registrado nos últimos dias.
          </Text>
        ) : (
          alertasPorDia.map((grupo) => (
            <View key={grupo.dia}>
              <Text style={styles.secao}>{grupo.dia}</Text>
              {grupo.alertas.map((alerta, index) => (
                <AlertaCard
                  key={`${grupo.dia}-${index}`}
                  tipo={alerta.tipo}
                  titulo={alerta.titulo}
                  hora={alerta.hora}
                  descricao={alerta.descricao}
                />
              ))}
            </View>
          ))
        )}
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
        <TouchableOpacity style={styles.bottomItem} onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.bottomText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}