import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './estilos/Formulario4Estilos';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

// Calcula os limites personalizados de som.
const calcularLimitesSom = (respostas) => {
  const respostasValidas = respostas.filter(
    resposta =>
      resposta.valor_sensor !== null &&
      resposta.valor_sensor !== undefined &&
      resposta.nivel_desconforto !== null &&
      resposta.nivel_desconforto !== undefined
  );

  if (respostasValidas.length === 0) {
    return {
      confortavel_ate: null,
      desconforto_a_partir: null,
    };
  }

  const confortaveis = respostasValidas
    .filter(
      resposta => resposta.nivel_desconforto === 1
    )
    .map(
      resposta => Number(resposta.valor_sensor)
    );

  const desconfortaveis = respostasValidas
    .filter(
      resposta => resposta.nivel_desconforto > 1
    )
    .map(
      resposta => Number(resposta.valor_sensor)
    );

  const confortavelAte =
    confortaveis.length > 0
      ? Math.max(...confortaveis)
      : null;

  const desconfortoAPartir =
    desconfortaveis.length > 0
      ? Math.min(...desconfortaveis)
      : null;

  return {
    confortavel_ate: confortavelAte,
    desconforto_a_partir: desconfortoAPartir,
  };
};

// Calcula a faixa personalizada de luminosidade.
const calcularLimitesLuz = (respostas) => {
  const respostasValidas = respostas.filter(
    resposta =>
      resposta.valor_sensor !== null &&
      resposta.valor_sensor !== undefined &&
      resposta.nivel_desconforto !== null &&
      resposta.nivel_desconforto !== undefined
  );

  if (respostasValidas.length === 0) {
    return {
      confortavel_de: null,
      confortavel_ate: null,
    };
  }

  const confortaveis = respostasValidas
    .filter(
      resposta => resposta.nivel_desconforto === 1
    )
    .map(
      resposta => Number(resposta.valor_sensor)
    );

  if (confortaveis.length === 0) {
    return {
      confortavel_de: null,
      confortavel_ate: null,
    };
  }

  const confortavelDe = Math.min(
    ...confortaveis
  );

  const confortavelAte = Math.max(
    ...confortaveis
  );

  return {
    confortavel_de: confortavelDe,
    confortavel_ate: confortavelAte,
  };
};

export default function Formulario4({
  navigation,
  route,
}) {
  const {
    session,
    setFormularioPreenchido,
  } = useAuth();

  const {
    somRespostas = [],
    luzRespostas = [],
  } = route.params || {};

  const limitesSom = useMemo(
    () => calcularLimitesSom(somRespostas),
    [somRespostas]
  );

  const limitesLuz = useMemo(
    () => calcularLimitesLuz(luzRespostas),
    [luzRespostas]
  );

  // Salva os limites personalizados no perfil do usuário.
  const handleSaveProfile = async () => {
    if (!session || !session.user) {
      Alert.alert(
        'Erro',
        'Usuário não autenticado. Por favor, faça login novamente.'
      );

      return;
    }

    const somValido =
      limitesSom.confortavel_ate !== null ||
      limitesSom.desconforto_a_partir !== null;

    const luzValida =
      limitesLuz.confortavel_de !== null &&
      limitesLuz.confortavel_ate !== null;

    if (!somValido) {
      Alert.alert(
        'Atenção',
        'Não foi possível determinar seus limites de som com as respostas fornecidas.'
      );

      return;
    }

    if (!luzValida) {
      Alert.alert(
        'Atenção',
        'Não foi possível determinar uma faixa confortável de luminosidade. É necessário ter pelo menos uma situação de luz classificada como confortável.'
      );

      return;
    }

    const { error } = await supabase
      .from('usuario')
      .update({
        formulario_preenchido: true,
        limites_som: limitesSom,
        limites_luz: limitesLuz,
      })
      .eq('id', session.user.id);

    if (error) {
      console.error(
        'Erro ao salvar limites:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível salvar seus limites. Tente novamente.'
      );

      return;
    }

    Alert.alert(
      'Perfil salvo!',
      'Seus limites personalizados foram definidos com sucesso.',
      [
        {
          text: 'OK',
          onPress: () => {
            setFormularioPreenchido(true);
          },
        },
      ]
    );
  };

  // Reinicia o formulário e remove os limites salvos.
  const handleRetakeForm = async () => {
    if (!session || !session.user) {
      Alert.alert(
        'Erro',
        'Usuário não autenticado.'
      );

      return;
    }

    const { error } = await supabase
      .from('usuario')
      .update({
        formulario_preenchido: false,
        limites_som: null,
        limites_luz: null,
      })
      .eq('id', session.user.id);

    if (error) {
      console.error(
        'Erro ao reiniciar formulário:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível reiniciar o formulário.'
      );

      return;
    }

    navigation.navigate('Formulario1');
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={require('../../fotos/arrow-left.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Image
          source={require('../../fotos/safiraLogo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.helpButton}
        >
          <Image
            source={require('../../fotos/question-mark.png')}
            style={styles.helpIcon}
          />
        </TouchableOpacity>

      </View>

      <View style={styles.progressBar}>

        <View style={styles.progressStep}>
          <Text style={styles.progressText}>
            1
          </Text>
        </View>

        <View style={styles.progressLine} />

        <View style={styles.progressStep}>
          <Text style={styles.progressText}>
            2
          </Text>
        </View>

        <View style={styles.progressLine} />

        <View style={styles.progressStep}>
          <Text style={styles.progressText}>
            3
          </Text>
        </View>

        <View style={styles.progressLine} />

        <View
          style={[
            styles.progressStep,
            styles.progressStepActive,
          ]}
        >
          <Text style={styles.progressTextActive}>
            4
          </Text>
        </View>

      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >

        <Text style={styles.mainTitle}>
          4. Seus limites personalizados
        </Text>

        <Text style={styles.description}>
          Com base nas situações que você avaliou,
          identificamos uma faixa personalizada de
          conforto para sons e luminosidade.
        </Text>

        <View style={styles.limitCard}>

          <View style={styles.limitHeader}>

            <Image
              source={require('../../fotos/icon-sound.png')}
              style={styles.limitIcon}
            />

            <Text style={styles.limitTitle}>
              Som
            </Text>

          </View>

          <Text style={styles.limitDescription}>
            Seu nível de conforto em relação ao
            volume dos sons.
          </Text>

          <View style={styles.limitBar}>

            <View
              style={[
                styles.limitBarComfort,
                {
                  flex:
                    limitesSom.confortavel_ate !== null
                      ? 1
                      : 0,
                },
              ]}
            />

            <View
              style={[
                styles.limitBarAttention,
                {
                  flex:
                    limitesSom.desconforto_a_partir !== null
                      ? 1
                      : 0,
                },
              ]}
            />

            <View
              style={[
                styles.limitBarDiscomfort,
                {
                  flex: 1,
                },
              ]}
            />

          </View>

          <View style={styles.limitLabels}>

            <View style={styles.limitLabel}>

              <Text style={styles.limitLabelTitle}>
                Confortável
              </Text>

              <Text style={styles.limitLabelValue}>
                {limitesSom.confortavel_ate !== null
                  ? `até ${limitesSom.confortavel_ate} dB`
                  : 'Não determinado'}
              </Text>

            </View>

            <View style={styles.limitLabel}>

              <Text style={styles.limitLabelTitle}>
                Atenção
              </Text>

              <Text style={styles.limitLabelValue}>
                {limitesSom.desconforto_a_partir !== null
                  ? `a partir de ${limitesSom.desconforto_a_partir} dB`
                  : 'Não determinado'}
              </Text>

            </View>

            <View style={styles.limitLabel}>

              <Text style={styles.limitLabelTitle}>
                Desconfortável
              </Text>

              <Text style={styles.limitLabelValue}>
                {limitesSom.desconforto_a_partir !== null
                  ? `≥ ${limitesSom.desconforto_a_partir} dB`
                  : 'Não determinado'}
              </Text>

            </View>

          </View>

        </View>

        <View style={styles.limitCard}>

          <View style={styles.limitHeader}>

            <Image
              source={require('../../fotos/icon-sun.png')}
              style={styles.limitIcon}
            />

            <Text style={styles.limitTitle}>
              Luminosidade
            </Text>

          </View>

          <Text style={styles.limitDescription}>
            Sua faixa de luminosidade considerada
            confortável.
          </Text>

          <View style={styles.limitBar}>

            <View
              style={[
                styles.limitBarDiscomfort,
                {
                  flex: 1,
                },
              ]}
            />

            <View
              style={[
                styles.limitBarComfort,
                {
                  flex: 1,
                },
              ]}
            />

            <View
              style={[
                styles.limitBarDiscomfort,
                {
                  flex: 1,
                },
              ]}
            />

          </View>

          <View style={styles.limitLabels}>

            <View style={styles.limitLabel}>

              <Text style={styles.limitLabelTitle}>
                Pouca luz
              </Text>

              <Text style={styles.limitLabelValue}>
                {limitesLuz.confortavel_de !== null
                  ? `abaixo de ${limitesLuz.confortavel_de} lux`
                  : 'Não determinado'}
              </Text>

            </View>

            <View style={styles.limitLabel}>

              <Text style={styles.limitLabelTitle}>
                Confortável
              </Text>

              <Text style={styles.limitLabelValue}>
                {limitesLuz.confortavel_de !== null &&
                limitesLuz.confortavel_ate !== null
                  ? `${limitesLuz.confortavel_de}–${limitesLuz.confortavel_ate} lux`
                  : 'Não determinado'}
              </Text>

            </View>

            <View style={styles.limitLabel}>

              <Text style={styles.limitLabelTitle}>
                Muita luz
              </Text>

              <Text style={styles.limitLabelValue}>
                {limitesLuz.confortavel_ate !== null
                  ? `acima de ${limitesLuz.confortavel_ate} lux`
                  : 'Não determinado'}
              </Text>

            </View>

          </View>

        </View>

        <View style={styles.infoBox}>

          <Image
            source={require('../../fotos/icon-light.png')}
            style={styles.infoIcon}
          />

          <Text style={styles.infoText}>
            Esses valores são estimativas personalizadas
            baseadas nas situações que você avaliou.
            Eles podem ser alterados posteriormente
            conforme suas necessidades.
          </Text>

        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProfile}
        >
          <Text style={styles.saveButtonText}>
            Salvar meu perfil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.retakeButton}
          onPress={handleRetakeForm}
        >
          <Text style={styles.retakeButtonText}>
            Refazer formulário
          </Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.progressBottomContainer}>

        <View style={styles.progressBottomBar}>

          <View
            style={[
              styles.progressBottomFill,
              {
                width: '100%',
              },
            ]}
          />

        </View>

        <Text style={styles.progressBottomText}>
          4 de 4
        </Text>

      </View>

    </SafeAreaView>
  );
}