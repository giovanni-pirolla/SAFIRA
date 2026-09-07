import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/Formulario4Estilos';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function Formulario4({ navigation }) {
  const { session } = useAuth();

  const handleSaveProfile = async () => {
    if (!session || !session.user) {
      Alert.alert('Erro', 'Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    const limites = {
      som: {
        confortavel_ate: 55,
        atencao_de: 56,
        atencao_ate: 70,
        desconfortavel_acima: 70,
      },
      luz: {
        confortavel_ate: 300,
        atencao_de: 301,
        atencao_ate: 700,
        desconfortavel_acima: 700,
      },
    };

    try {
      const { error } = await supabase
        .from('usuario')
        .update({
          formulario_preenchido: true,
          limites_som: limites.som,
          limites_luz: limites.luz,
        })
        .eq('id', session.user.id);

      if (error) {
        console.error('Erro ao salvar limites do usuário:', error.message);
        Alert.alert('Erro', 'Não foi possível salvar seus limites. Tente novamente.');
      } else {
        Alert.alert('Sucesso', 'Seus limites foram salvos com sucesso!');
        navigation.navigate('TelaInicial');
      }
    } catch (error) {
      console.error('Erro inesperado ao salvar limites:', error.message);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  const handleRetakeForm = () => {
    Alert.alert(
      'Refazer formulário',
      'Você tem certeza que deseja refazer o formulário? Seus limites atuais serão apagados.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            if (!session || !session.user) {
              Alert.alert('Erro', 'Usuário não autenticado. Por favor, faça login novamente.');
              return;
            }

            try {
              const { error } = await supabase
                .from('usuario')
                .update({
                  formulario_preenchido: false, // Define como false
                  limites_som: null,            // Reseta para NULL
                  limites_luz: null,            // Reseta para NULL
                })
                .eq('id', session.user.id);

              if (error) {
                console.error('Erro ao resetar limites do usuário:', error.message);
                Alert.alert('Erro', 'Não foi possível resetar seus limites. Tente novamente.');
              } else {
                Alert.alert('Sucesso', 'Seus limites foram resetados. Você pode refazer o formulário.');
                navigation.navigate('Formulario1'); // Volta para o início do formulário
              }
            } catch (error) {
              console.error('Erro inesperado ao resetar limites:', error.message);
              Alert.alert('Erro', 'Ocorreu um erro inesperado ao resetar. Tente novamente.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevious} style={styles.backButton}>
          <Image source={require('../../fotos/arrow-left.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Image source={require('../../fotos/safiraLogo.png')} style={styles.headerLogo} resizeMode="contain" />
        <TouchableOpacity style={styles.helpButton}>
          <Image source={require('../../fotos/question-mark.png')} style={styles.helpIcon} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar (Top) */}
      <View style={styles.progressBar}>
        <View style={styles.progressStep}>
          <Text style={styles.progressText}>1</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <Text style={styles.progressText}>2</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <Text style={styles.progressText}>3</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={[styles.progressStep, styles.progressStepActive]}>
          <Text style={styles.progressTextActive}>4</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Content */}
        <Text style={styles.mainTitle}>4. Resumo dos seus limites</Text>
        <Text style={styles.description}>
          Com base nas suas respostas, definimos os seguintes limites personalizados.
        </Text>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            Esses limites serão usados pelo SAFIRA para te avisar quando o ambiente estiver se aproximando ou
            ultrapassando seu nível de conforto.
          </Text>
        </View>

        {/* Sound Limits */}
        <View style={styles.limitSection}>
          <View style={styles.limitHeader}>
            <Image source={require('../../fotos/icon-sound.png')} style={styles.limitIcon} />
            <Text style={styles.limitTitle}>Som (ruído)</Text>
          </View>
          <View style={styles.limitBarContainer}>
            <View style={[styles.limitBarSegment, styles.limitBarComfort]} />
            <View style={[styles.limitBarSegment, styles.limitBarAttention]} />
            <View style={[styles.limitBarSegment, styles.limitBarDiscomfort]} />
          </View>
          <View style={styles.limitLabelsContainer}>
            <View style={styles.limitLabelItem}>
              <Text style={styles.limitLabelText}>Confortável</Text>
              <Text style={styles.limitLabelValue}>até 55 dB</Text>
            </View>
            <View style={styles.limitLabelItem}>
              <Text style={styles.limitLabelText}>Atenção</Text>
              <Text style={styles.limitLabelValue}>56 – 70 dB</Text>
            </View>
            <View style={styles.limitLabelItem}>
              <Text style={styles.limitLabelText}>Desconfortável</Text>
              <Text style={styles.limitLabelValue}>acima de 70 dB</Text>
            </View>
          </View>
        </View>

        {/* Light Limits */}
        <View style={styles.limitSection}>
          <View style={styles.limitHeader}>
            <Image source={require('../../fotos/icon-sun.png')} style={styles.limitIcon} />
            <Text style={styles.limitTitle}>Luz (luminosidade)</Text>
          </View>
          <View style={styles.limitBarContainer}>
            <View style={[styles.limitBarSegment, styles.limitBarComfort]} />
            <View style={[styles.limitBarSegment, styles.limitBarAttention]} />
            <View style={[styles.limitBarSegment, styles.limitBarDiscomfort]} />
          </View>
          <View style={styles.limitLabelsContainer}>
            <View style={styles.limitLabelItem}>
              <Text style={styles.limitLabelText}>Confortável</Text>
              <Text style={styles.limitLabelValue}>100 – 300 lux</Text>
            </View>
            <View style={styles.limitLabelItem}>
              <Text style={styles.limitLabelText}>Atenção</Text>
              <Text style={styles.limitLabelValue}>301 – 700 lux</Text>
            </View>
            <View style={styles.limitLabelItem}>
              <Text style={styles.limitLabelText}>Desconfortável</Text>
              <Text style={styles.limitLabelValue}>acima de 700 lux</Text>
            </View>
          </View>
        </View>

        {/* Ready Message */}
        <View style={styles.readyBox}>
          <Image source={require('../../fotos/icon-check.png')} style={styles.readyIcon} />
          <Text style={styles.readyText}>
            <Text style={styles.readyTextBold}>Quase pronto!</Text>{'\n'}
            Você pode editar esses limites depois, a qualquer momento, no seu perfil.
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Salvar meu perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.retakeButton} onPress={handleRetakeForm}>
          <Text style={styles.retakeButtonText}>Refazer formulário</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Progress Indicator */}
      <View style={styles.progressBottomContainer}>
        <View style={styles.progressBottomBar}>
          <View style={styles.progressBottomFill} />
        </View>
        <Text style={styles.progressBottomText}>3 de 3</Text>
      </View>
    </SafeAreaView>
  );
}