import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/Formulario3Estilos';

export default function Formulario3({ navigation, route }) {
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const { somFeeling } = route.params || {}; // Recebe o sentimento de som do Formulario2

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (!selectedFeeling) {
      Alert.alert('Atenção', 'Por favor, selecione como você se sentiria nesta situação.');
      return;
    }
    console.log('Sentimento selecionado (luz):', selectedFeeling);
    // Passa o sentimento de som e o sentimento de luz para o Formulario4
    navigation.navigate('Formulario4', { somFeeling, luzFeeling: selectedFeeling });
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
        <View style={[styles.progressStep, styles.progressStepActive]}>
          <Text style={styles.progressTextActive}>3</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <Text style={styles.progressText}>4</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Content */}
        <Text style={styles.mainTitle}>3. Avaliação de luz</Text>
        <Text style={styles.description}>
          Avalie como você se sentiria em cada situação de acordo com o nível de luminosidade.
        </Text>

        {/* Info Card (Sun Icon) */}
        <View style={styles.infoCardContainer}>
          <Image source={require('../../fotos/icon-sun.png')} style={styles.infoCardIcon} />
          <Text style={styles.infoCardText}>
            Considere ambientes do seu dia a dia (escola, casa, rua, shoppings, etc).
          </Text>
        </View>

        {/* Situation Card */}
        <Text style={styles.situationTitle}>Situação 2 de 2</Text>
        <View style={styles.situationCard}>
          <Image source={require('../../fotos/sala_iluminada.png')} style={styles.situationImage} />
          <View style={styles.situationDetails}>
            <Text style={styles.situationDetailTitle}>Sala muito iluminada</Text>
            <Text style={styles.situationDetailText}>
              Ambiente com muita luz natural entrando pelas janelas.
            </Text>
            <View style={styles.situationDetailSoundLevelContainer}>
              <Image source={require('../../fotos/icon-sun.png')} style={styles.situationDetailSoundLevelIcon} />
              <Text style={styles.situationDetailSoundLevelText}>Nível de luz: 800 lux</Text>
            </View>
          </View>
        </View>

        {/* Feeling/Discomfort Section */}
        <Text style={styles.feelingQuestion}>Como você se sentiria nessa situação?</Text>
        <Text style={styles.feelingSubQuestion}>Considere seu nível de desconforto.</Text>
        <View style={styles.feelingOptionsContainer}>
          <TouchableOpacity
            style={[styles.feelingOption, selectedFeeling === 'confortavel' && styles.feelingOptionActive]}
            onPress={() => setSelectedFeeling('confortavel')}
          >
            <Text style={styles.feelingOptionEmoji}>😊</Text>
            <Text style={styles.feelingOptionText}>Confortável</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feelingOption, selectedFeeling === 'levemente_desconfortavel' && styles.feelingOptionActive]}
            onPress={() => setSelectedFeeling('levemente_desconfortavel')}
          >
            <Text style={styles.feelingOptionEmoji}>😐</Text>
            <Text style={styles.feelingOptionText}>Levemente desconfortável</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feelingOption, selectedFeeling === 'desconfortavel' && styles.feelingOptionActive]}
            onPress={() => setSelectedFeeling('desconfortavel')}
          >
            <Text style={styles.feelingOptionEmoji}>😟</Text>
            <Text style={styles.feelingOptionText}>Desconfortável</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feelingOption, selectedFeeling === 'muito_desconfortavel' && styles.feelingOptionActive]}
            onPress={() => setSelectedFeeling('muito_desconfortavel')}
          >
            <Text style={styles.feelingOptionEmoji}>😡</Text>
            <Text style={styles.feelingOptionText}>Muito desconfortável</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navigation Buttons (Bottom) */}
      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
          <Text style={styles.previousButtonText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Próxima</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Progress Indicator */}
      <View style={styles.progressBottomContainer}>
        <View style={styles.progressBottomBar}>
          <View style={styles.progressBottomFill} />
        </View>
        <Text style={styles.progressBottomText}>2 de 2</Text>
      </View>
    </SafeAreaView>
  );
}