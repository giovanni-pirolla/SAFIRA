import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, Modal, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/ConfiguracaoEstilos';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

export default function Configuracao({ navigation }) {
  const { session } = useAuth();
  const userEmail = session?.user?.email || 'N/A'; // Obtém o e-mail do usuário logado

  const [isModalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Erro ao sair', error.message);
    } else {
      // A navegação será tratada pelo AppNavigator que detecta a ausência da sessão
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Erro ao alterar senha:', error.message);
        Alert.alert('Erro ao alterar senha', error.message);
      } else {
        Alert.alert('Sucesso', 'Sua senha foi alterada com sucesso!');
        setModalVisible(false);
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Erro inesperado ao alterar senha:', error.message);
      Alert.alert('Erro', 'Ocorreu um erro inesperado ao alterar a senha.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Seção de Conta */}
        <Text style={styles.sectionTitle}>Conta</Text>
        <View style={styles.optionContainer}>
          <Text style={styles.optionIcon}>✉️</Text>
          <Text style={styles.optionLabel}>E-mail</Text>
          <Text style={styles.optionValue}>{userEmail}</Text>
          <Text style={styles.optionArrow}>›</Text>
        </View>

        <Pressable style={styles.optionContainer} onPress={() => setModalVisible(true)}>
          <Text style={styles.optionIcon}>🔒</Text>
          <Text style={styles.optionLabel}>Alterar Senha</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>

        {/* Seção de Preferências */}
        <Text style={styles.sectionTitle}>Preferências</Text>
        <Pressable style={styles.optionContainer} onPress={() => Alert.alert('Funcionalidade', 'Alterar Tema')}>
          <Text style={styles.optionIcon}>🌙</Text>
          <Text style={styles.optionLabel}>Tema</Text>
          <Text style={styles.optionValue}>Claro</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.optionContainer} onPress={() => Alert.alert('Funcionalidade', 'Gerenciar Notificações')}>
          <Text style={styles.optionIcon}>🔔</Text>
          <Text style={styles.optionLabel}>Notificações</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.optionContainer} onPress={() => Alert.alert('Funcionalidade', 'Unidades de Medida')}>
          <Text style={styles.optionIcon}>📏</Text>
          <Text style={styles.optionLabel}>Unidades de Medida</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>

        {/* Seção de Privacidade e Bem-Estar */}
        <Text style={styles.sectionTitle}>Privacidade e Bem-Estar</Text>
        <Pressable style={styles.optionContainer} onPress={() => Alert.alert('Funcionalidade', 'Privacidade dos dados')}>
          <Text style={styles.optionIcon}>🛡️</Text>
          <Text style={styles.optionLabel}>Privacidade dos dados</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.optionContainer} onPress={() => Alert.alert('Funcionalidade', 'Cuidadores e Responsáveis')}>
          <Text style={styles.optionIcon}>👥</Text>
          <Text style={styles.optionLabel}>Cuidadores e Responsáveis</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>

        {/* Botão de Sair (mantido, mas não na imagem de referência principal) */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Alterar Senha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Nova Senha"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Nova Senha"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonSave]}
                onPress={handleChangePassword}
              >
                <Text style={styles.textStyle}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}