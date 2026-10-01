import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/Formulario2Estilos';

export default function Formulario2({ navigation }) {
  const [selectedFeeling, setSelectedFeeling] = useState(null);

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (!selectedFeeling) {
      Alert.alert('Atenção', 'Por favor, selecione como você se sentiria nesta situação.');
      return;
    }
    console.log('Sentimento selecionado (som):', selectedFeeling);
    // Passa a escolha do sentimento de som para o próximo formulário
    navigation.navigate('Formulario3', { somFeeling: selectedFeeling });
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
        <View style={[styles.progressStep, styles.progressStepActive]}>
          <Text style={styles.progressTextActive}>2</Text>
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
        <Text style={styles.mainTitle}>2. Avaliação de som</Text>
        <Text style={styles.description}>
          Avalie como você se sentiria em cada situação de acordo com o nível de ruído.
        </Text>

        {/* Info Card (Sound Icon) */}
        <View style={styles.infoCardContainer}>
          <Image source={require('../../fotos/icon-sound.png')} style={styles.infoCardIcon} />
          <Text style={styles.infoCardText}>
            Considere ambientes do seu dia a dia (escola, casa, rua, shoppings, etc).
          </Text>
        </View>

        {/* Situation Card */}
        <Text style={styles.situationTitle}>Situação 1 de 2</Text>
        <View style={styles.situationCard}>
          <Image source={require('../../fotos/biblioteca.png')} style={styles.situationImage} />
          <View style={styles.situationDetails}>
            <Text style={styles.situationDetailTitle}>Biblioteca silenciosa</Text>
            <Text style={styles.situationDetailText}>
              Ambiente calmo e tranquilo, ideal para concentração.
            </Text>
            <View style={styles.situationDetailSoundLevelContainer}>
              <Image source={require('../../fotos/icon-sound.png')} style={styles.situationDetailSoundLevelIcon} />
              <Text style={styles.situationDetailSoundLevelText}>Nível de som: 30 dB</Text>
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
            <Image style={styles.feelingOptionEmoji} source={require('../../fotos/meme.png')} />
            <Text style={styles.feelingOptionText}>Confortável</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.feelingOption, selectedFeeling === 'levemente_desconfortavel' && styles.feelingOptionActive]}
            onPress={() => setSelectedFeeling('levemente_desconfortavel')}
          >
            <Image style={styles.feelingOptionEmoji} source={require('../../fotos/icon-indiferente.png')} />
            <Text style={styles.feelingOptionText}>Levemente desconfortável</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.feelingOption, selectedFeeling === 'desconfortavel' && styles.feelingOptionActive]}
            onPress={() => setSelectedFeeling('desconfortavel')}
          >
            <Image style={styles.feelingOptionEmoji} source={require('../../fotos/icon-inconfortavel.png')} />
            <Text style={styles.feelingOptionText}>Desconfortável</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.feelingOption, selectedFeeling === 'muito_desconfortavel' && styles.feelingOptionActive]}
            onPress={() => setSelectedFeeling('muito_desconfortavel')}
          >
            <Image style={styles.feelingOptionEmoji} source={require('../../fotos/icon-angry.png')} />
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
        <Text style={styles.progressBottomText}>1 de 2</Text>
      </View>
    </SafeAreaView>
  );
}