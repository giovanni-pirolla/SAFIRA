import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/Formulario3Estilos';
import { supabase } from '../services/supabase';

// Mapeamento estático de todas as imagens que estão no supabase
const mapeamentoImagens = {
  'banheiro.png': require('../../fotos/situacoes_questionario/banheiro.png'),
  'biblioteca.png': require('../../fotos/situacoes_questionario/biblioteca.png'),
  'praca_alimentacao.png': require('../../fotos/situacoes_questionario/praca_alimentacao.png'),
  'sala_aula.png': require('../../fotos/situacoes_questionario/sala_aula.png'),
  'sala_espera.png': require('../../fotos/situacoes_questionario/sala_espera.png')
};

export default function Formulario3({ navigation, route }) {
  const [situacoes, setSituacoes] = useState([]);
  const [situacaoAtual, setSituacaoAtual] = useState(0);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Recebe as respostas de SOM
  const {
    somRespostas = []
  } = route.params || {};

  // Busca as situações de LUMINOSIDADE no banco
  useEffect(() => {
    async function carregarSituacoes() {
      const { data, error } = await supabase
        .from('situacoes_questionario')
        .select('*')
        .eq('tipo_sensor', 'luminosidade')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) {
        console.error(
          'Erro ao carregar situações de luz:',
          error
        );

        Alert.alert(
          'Erro',
          'Não foi possível carregar as situações de luminosidade.'
        );

        setCarregando(false);
        return;
      }

      setSituacoes(data || []);
      setCarregando(false);
    }

    carregarSituacoes();
  }, []);

  /*
   * Quando a situação muda, procura se ela já foi respondida.
   *
   * Isso permite que o usuário volte e veja sua resposta
   * anterior antes de alterá-la.
   */
  useEffect(() => {
    if (situacoes.length > 0) {
      const situacao = situacoes[situacaoAtual];

      const respostaExistente = respostas.find(
        resposta => resposta.situacao_id === situacao.id
      );

      setSelectedFeeling(
        respostaExistente
          ? respostaExistente.resposta
          : null
      );
    }
  }, [situacaoAtual, situacoes, respostas]);

  const handlePrevious = () => {
    // Se não estiver na primeira situação,
    // volta uma situação.
    if (situacaoAtual > 0) {
      setSituacaoAtual(situacaoAtual - 1);
      return;
    }

    /*
     * Se estiver na primeira situação de luminosidade,
     * volta para a última tela do formulário de som.
     */
    navigation.goBack();
  };

  const handleNext = () => {
    if (!selectedFeeling) {
      Alert.alert(
        'Atenção',
        'Por favor, selecione como você se sentiria nesta situação.'
      );

      return;
    }

    const situacao = situacoes[situacaoAtual];

    /*
     * Converte a resposta textual em nível numérico.
     */
    const niveisDesconforto = {
      confortavel: 1,
      levemente_desconfortavel: 2,
      desconfortavel: 3,
      muito_desconfortavel: 4,
    };

    const novaResposta = {
      situacao_id: situacao.id,
      valor_sensor: Number(situacao.valor_sensor),
      unidade: situacao.unidade,
      resposta: selectedFeeling,
      nivel_desconforto: niveisDesconforto[selectedFeeling],
    };

    /*
     * Remove a resposta anterior dessa mesma situação
     * e coloca a nova no lugar.
     *
     * Isso garante que alterar uma resposta não gere
     * respostas duplicadas.
     */
    const respostasAtualizadas = [
      ...respostas.filter(
        resposta =>
          resposta.situacao_id !== situacao.id
      ),
      novaResposta,
    ];

    setRespostas(respostasAtualizadas);

    /*
     * Ainda existem situações de luminosidade.
     */
    if (situacaoAtual < situacoes.length - 1) {
      setSituacaoAtual(situacaoAtual + 1);
      return;
    }

    /*
     * Terminou todas as situações de luminosidade.
     *
     * Envia para o Formulario4 tanto as respostas
     * de som quanto as respostas de luminosidade.
     */
    navigation.navigate('Formulario4', {
      somRespostas,
      luzRespostas: respostasAtualizadas,
    });
  };

  /*
   * Estado de carregamento.
   */
  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text>
            Carregando situações...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
   * Caso não existam situações de luminosidade.
   */
  if (situacoes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20
          }}
        >
          <Text>
            Nenhuma situação de luminosidade foi encontrada.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const situacao = situacoes[situacaoAtual];

  const imagemOrigem = mapeamentoImagens[situacao.imagem_path];

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={handlePrevious}
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

        <TouchableOpacity style={styles.helpButton}>
          <Image
            source={require('../../fotos/question-mark.png')}
            style={styles.helpIcon}
          />
        </TouchableOpacity>

      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>

        <View style={styles.progressStep}>
          <Text style={styles.progressText}>1</Text>
        </View>

        <View style={styles.progressLine} />

        <View style={styles.progressStep}>
          <Text style={styles.progressText}>2</Text>
        </View>

        <View style={styles.progressLine} />

        <View
          style={[
            styles.progressStep,
            styles.progressStepActive
          ]}
        >
          <Text style={styles.progressTextActive}>3</Text>
        </View>

        <View style={styles.progressLine} />

        <View style={styles.progressStep}>
          <Text style={styles.progressText}>4</Text>
        </View>

      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Main Content */}
        <Text style={styles.mainTitle}>
          3. Avaliação de luz
        </Text>

        <Text style={styles.description}>
          Avalie como você se sentiria em cada situação de acordo com o nível de luminosidade.
        </Text>

        {/* Info Card */}
        <View style={styles.infoCardContainer}>

          <Image
            source={require('../../fotos/icon-sun.png')}
            style={styles.infoCardIcon}
          />

          <Text style={styles.infoCardText}>
            Considere ambientes do seu dia a dia (escola, casa, rua, shoppings, etc).
          </Text>

        </View>

        {/* Situation Card */}
        <Text style={styles.situationTitle}>
          Situação {situacaoAtual + 1} de {situacoes.length}
        </Text>

        <View style={styles.situationCard}>

          <Image
            source={imagemOrigem || require('../../fotos/situacoes_questionario/placeholder.png')}
            style={styles.situationImage}
          />

          <View style={styles.situationDetails}>

            <Text style={styles.situationDetailTitle}>
              {situacao.titulo}
            </Text>

            <Text style={styles.situationDetailText}>
              {situacao.descricao}
            </Text>

            <View style={styles.situationDetailSoundLevelContainer}>

              <Image
                source={require('../../fotos/icon-sun.png')}
                style={styles.situationDetailSoundLevelIcon}
              />

              <Text style={styles.situationDetailSoundLevelText}>
                Nível de luz: {situacao.valor_sensor} {situacao.unidade}
              </Text>

            </View>

          </View>

        </View>

        {/* Feeling/Discomfort Section */}
        <Text style={styles.feelingQuestion}>
          Como você se sentiria nessa situação?
        </Text>

        <Text style={styles.feelingSubQuestion}>
          Considere seu nível de desconforto.
        </Text>

        <View style={styles.feelingOptionsContainer}>

          {/* Confortável */}
          <TouchableOpacity
            style={[
              styles.feelingOption,
              selectedFeeling === 'confortavel' &&
                styles.feelingOptionActive
            ]}
            onPress={() =>
              setSelectedFeeling('confortavel')
            }
          >
            <Image
              style={styles.feelingOptionEmoji}
              source={require('../../fotos/meme.png')}
            />

            <Text style={styles.feelingOptionText}>
              Confortável
            </Text>
          </TouchableOpacity>

          {/* Levemente desconfortável */}
          <TouchableOpacity
            style={[
              styles.feelingOption,
              selectedFeeling === 'levemente_desconfortavel' &&
                styles.feelingOptionActive
            ]}
            onPress={() =>
              setSelectedFeeling(
                'levemente_desconfortavel'
              )
            }
          >
            <Image
              style={styles.feelingOptionEmoji}
              source={require('../../fotos/icon-indiferente.png')}
            />

            <Text style={styles.feelingOptionText}>
              Levemente desconfortável
            </Text>
          </TouchableOpacity>

          {/* Desconfortável */}
          <TouchableOpacity
            style={[
              styles.feelingOption,
              selectedFeeling === 'desconfortavel' &&
                styles.feelingOptionActive
            ]}
            onPress={() =>
              setSelectedFeeling('desconfortavel')
            }
          >
            <Image
              style={styles.feelingOptionEmoji}
              source={require('../../fotos/icon-inconfortavel.png')}
            />

            <Text style={styles.feelingOptionText}>
              Desconfortável
            </Text>
          </TouchableOpacity>

          {/* Muito desconfortável */}
          <TouchableOpacity
            style={[
              styles.feelingOption,
              selectedFeeling === 'muito_desconfortavel' &&
                styles.feelingOptionActive
            ]}
            onPress={() =>
              setSelectedFeeling(
                'muito_desconfortavel'
              )
            }
          >
            <Image
              style={styles.feelingOptionEmoji}
              source={require('../../fotos/icon-angry.png')}
            />

            <Text style={styles.feelingOptionText}>
              Muito desconfortável
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtonsContainer}>

        <TouchableOpacity
          style={styles.previousButton}
          onPress={handlePrevious}
        >
          <Text style={styles.previousButtonText}>
            Anterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            Próxima
          </Text>
        </TouchableOpacity>

      </View>

      {/* Bottom Progress Indicator */}
      <View style={styles.progressBottomContainer}>

        <View style={styles.progressBottomBar}>
          <View
            style={[
              styles.progressBottomFill,
              {
                width: `${
                  ((situacaoAtual + 1) /
                    situacoes.length) *
                  100
                }%`
              }
            ]}
          />
        </View>

        <Text style={styles.progressBottomText}>
          {situacaoAtual + 1} de {situacoes.length}
        </Text>

      </View>

    </SafeAreaView>
  );
}