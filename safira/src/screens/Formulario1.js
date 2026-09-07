import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/Formulario1Estilos';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Formulario1({ navigation }) {
  const { session } = useAuth();

  async function handleComecar() {
    if (!session || !session.user) {
      Alert.alert('Erro', 'Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    // REMOVIDO: A atualização de formulario_preenchido para true não acontece mais aqui.
    // Isso será feito apenas no Formulario4.js ao clicar em "Salvar meu perfil".

    navigation.navigate('Formulario2'); // Navegar para Formulario2.js
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../../fotos/arrow-left.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Image source={require('../../fotos/safiraLogo.png')} style={styles.headerLogo} resizeMode="contain" />
        <TouchableOpacity style={styles.helpButton}>
          <Image source={require('../../fotos/question-mark.png')} style={styles.helpIcon} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar (Top) */}
      <View style={styles.progressBar}>
        <View style={[styles.progressStep, styles.progressStepActive]}>
          <Text style={styles.progressTextActive}>1</Text>
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
        <View style={styles.progressStep}>
          <Text style={styles.progressText}>4</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Content */}
        <Text style={styles.mainTitle}>1. Instruções</Text>
        <Text style={styles.description}>
          Este formulário vai nos ajudar a entender como diferentes níveis de estímulos sonoros e luminosos te afetam no dia a dia.
        </Text>

        {/* Seção de ícones e descrições */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Image source={require('../../fotos/icon-sound.png')} style={styles.infoImageIcon} />
            <Text style={styles.infoText}>Você verá algumas situações com níveis de som e de luz diferentes.</Text>
          </View>
          <View style={styles.infoItem}>
            <Image source={require('../../fotos/icon-happy.png')} style={styles.infoImageIcon} />
            <Text style={styles.infoText}>Para cada situação, indique como você se sentiria.</Text>
          </View>
          <View style={styles.infoItem}>
            <Image source={require('../../fotos/icon-target.png')} style={styles.infoImageIcon} />
            <Text style={styles.infoText}>Com suas respostas, definiremos seus limites personalizados de conforto.</Text>
          </View>
        </View>

        {/* Como funciona */}
        <View style={styles.howItWorks}>
          <Text style={styles.howItWorksTitle}>Como funciona?</Text>
          <Text style={styles.howItWorksText}>1. Avalie situações de som (ruído)</Text>
          <Text style={styles.howItWorksText}>2. Avalie situações de luz (luminosidade)</Text>
          <Text style={styles.howItWorksText}>3. Veja o resumo dos seus limites</Text>
          <Text style={styles.howItWorksText}>4. Salve seu perfil e pronto!</Text>
        </View>

        {/* Dica */}
        <View style={styles.tipBox}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            <Text style={styles.tipTextBold}>Dica</Text>{'\n'}
            Não existe resposta certa ou errada. O mais importante é ser sincero(a) com o que você sente.
          </Text>
        </View>

        {/* Botão Começar */}
        <TouchableOpacity style={styles.startButton} onPress={handleComecar}>
          <Text style={styles.startButtonText}>Começar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}