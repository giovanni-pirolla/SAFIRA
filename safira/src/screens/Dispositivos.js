import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';
import styles from './estilos/DispositivosEstilos';

function DispositivoCard({ nome, id_unico, status, bateria, atualizado }) {
  const ativo = status === 'Ativo';

  const badgeStyle = ativo
    ? styles.badgeAtivo
    : styles.badgeInativo;

  const badgeTextStyle = ativo
    ? styles.badgeTextAtivo
    : styles.badgeTextInativo;

  const bateriaCor = bateria > 20
    ? styles.bateriaAlta
    : styles.bateriaBaixa;

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconeQuadrado}>
        <Image style={styles.iconeEmoji} source={require('../../fotos/icon-cracha.png')}/>
      </View>

      <View style={styles.cardConteudo}>
        <View style={styles.nomeLinha}>
          <Text style={styles.nomeTexto}>{nome}</Text>
          <Image style={styles.iconeCaneta} source={require('../../fotos/icon-pen.png')}/>
        </View>

        <Text style={styles.ambienteTexto}>{id_unico}</Text>

        <View style={styles.infoLinha}>
          <View style={styles.bateriaWrapper}>
            <View style={styles.bateriaBase}>
              <View
                style={[
                  styles.bateriaPreenchimento,
                  bateriaCor,
                  { width: `${bateria}%` },
                ]}
              />
            </View>

            <Text style={styles.bateriaTexto}>
              {bateria}%
            </Text>
          </View>

          <Text style={styles.pontoSeparador}>•</Text>

          <Text style={styles.atualizadoTexto}>
            {atualizado}
          </Text>
        </View>
      </View>

      <View style={styles.ladoDireito}>
        <View style={badgeStyle}>
          <Text style={badgeTextStyle}>
            {status}
          </Text>
        </View>

        <Text style={styles.setaTexto}>{'>'}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Dispositivos({ navigation }) {

  const [dispositivos, setDispositivos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {

    async function buscarDispositivos() {

      try {

        setCarregando(true);
        setErro(null);

        // Busca o usuário atualmente autenticado
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error('Usuário não autenticado.');
        }

        console.log('UID DO USUÁRIO:', user.id);

        // Busca somente os dispositivos pertencentes ao usuário
        const {
          data,
          error,
        } = await supabase
          .from('dispositivos')
          .select('*')
          .eq('idusuario', user.id);

        if (error) {
          throw error;
        }

        console.log('DISPOSITIVOS DO USUÁRIO:', data);

        setDispositivos(data || []);

      } catch (error) {

        console.error(
          'ERRO AO BUSCAR DISPOSITIVOS:',
          error
        );

        setErro(
          'Não foi possível carregar os dispositivos.'
        );

      } finally {

        setCarregando(false);

      }
    }

    buscarDispositivos();

  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Dispositivos
        </Text>

        <View style={styles.headerSpacer} />

      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Carregando */}
        {carregando && (
          <Text>
            Carregando dispositivos...
          </Text>
        )}

        {/* Erro */}
        {!carregando && erro && (
          <Text>
            {erro}
          </Text>
        )}

        {/* Nenhum dispositivo */}
        {!carregando &&
          !erro &&
          dispositivos.length === 0 && (
            <Text>
              Nenhum dispositivo cadastrado.
            </Text>
          )}

        {/* Dispositivos do usuário */}
        {!carregando &&
          !erro &&
          dispositivos.map((dispositivo) => (

            <DispositivoCard
              key={dispositivo.iddispositivos}

              nome={
                dispositivo.nome ||
                'Dispositivo SAFIRA'
              }

              id_unico={dispositivo.id_unico}

              status={
                dispositivo.status
                  ? 'Ativo'
                  : 'Inativo'
              }

              bateria={100}

              atualizado="Sem dados recentes"
            />

          ))}

      </ScrollView>

      {/* Botão flutuante de adicionar dispositivo */}
      <Pressable
        style={styles.fab}
        onPress={() =>
          navigation.navigate('AddDispositivo')
        }
      >
        <Text style={styles.fabTexto}>+</Text>
      </Pressable>

      {/* Rodapé de navegação */}
      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() =>
            navigation.navigate('TelaInicial')
          }
        >
          <Text style={styles.bottomText}>
            Início
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() =>
            navigation.navigate('Historico')
          }
        >
          <Text style={styles.bottomText}>
            Histórico
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomItem}>
          <Text
            style={[
              styles.bottomText,
              styles.bottomTextActive,
            ]}
          >
            Dispositivos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() =>
            navigation.navigate('Perfil')
          }
        >
          <Text style={styles.bottomText}>
            Perfil
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}