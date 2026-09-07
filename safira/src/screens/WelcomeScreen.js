import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/WelcomeScreenEstilos';


export default function WelcomeScreen({ navigation }) {
return (
    <SafeAreaView style={styles.container}>
    <View style={styles.iconCircle}>
        {/* logo da Safira */}
        <Image
        source={require('../../fotos/safiraLogo.png')}
        style={styles.iconImage}
        resizeMode="contain"/>
    </View>

    {/* textos da parte superior da tela */}
    <Text style={styles.title}>BEM-VINDO!</Text>
    <Text style={styles.subtitle}>
        Faça login ou crie sua conta{'\n'}para continuar
    </Text>

    {/*imagem chatzinho dos gráficos */}
    <Image
    source={require('../../fotos/graficoWelcome.png')}
    style={styles.illustration}
    resizeMode="contain"/>

    {/*botões de 'entrar' e 'cadastrar' */}
    <View style={styles.buttonsWrapper}>
        <TouchableOpacity
        style={[styles.button, styles.buttonPrimary]}
        onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
    </View>
</SafeAreaView>
);
}