import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '../services/authService';
import styles from './estilos/LoginScreenEstilos';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }

    setErro('');
    setCarregando(true);

    const { error } = await login(email.trim(), senha);

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }
    // Sessão detectada automaticamente pelo AuthContext, navegação é automática
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Image source={require('../../fotos/safiraLogo.png')}
          style={styles.logo}
          resizeMode="contain"/>
          <Text style={styles.titulo}>Bem-vindo de volta</Text>
          <Text style={styles.subtitulo}>Entre com sua conta para continuar</Text>

          <View style={styles.campoWrapper}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#B5B5B5"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.campoWrapper}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#B5B5B5"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          {erro ? <Text style={styles.erroTexto}>{erro}</Text> : null}

          <TouchableOpacity
            style={[styles.botaoPrimario, carregando && styles.botaoDesabilitado]}
            onPress={handleLogin}
            disabled={carregando}
          >
            <Text style={styles.botaoPrimarioTexto}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkWrapper}
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text style={styles.linkTexto}>
              Não tem uma conta? <Text style={styles.linkTextoDestaque}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}