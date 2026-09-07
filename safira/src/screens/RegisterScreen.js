import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cadastrar } from '../services/authService';
import styles from './estilos/RegisterScreenEstilos';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro() {
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos.');
      setSucesso('');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      setSucesso('');
      return;
    }

    setErro('');
    setSucesso('');
    setCarregando(true);

    const { error } = await cadastrar(nome.trim(), email.trim(), senha);

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setSucesso('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.titulo}>Criar conta</Text>
          <Text style={styles.subtitulo}>Preencha seus dados para começar</Text>

          <View style={styles.campoWrapper}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              placeholderTextColor="#B5B5B5"
              value={nome}
              onChangeText={setNome}
            />
          </View>

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
              placeholder="Crie uma senha"
              placeholderTextColor="#B5B5B5"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <View style={styles.campoWrapper}>
            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Repita a senha"
              placeholderTextColor="#B5B5B5"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
          </View>

          {erro ? <Text style={styles.erroTexto}>{erro}</Text> : null}
          {sucesso ? <Text style={styles.sucessoTexto}>{sucesso}</Text> : null}

          <TouchableOpacity
            style={[styles.botaoPrimario, carregando && styles.botaoDesabilitado]}
            onPress={handleCadastro}
            disabled={carregando}
          >
            <Text style={styles.botaoPrimarioTexto}>
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkWrapper}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.linkTexto}>
              Já tem uma conta? <Text style={styles.linkTextoDestaque}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}