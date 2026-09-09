import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, Modal, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './estilos/ConfiguracaoEstilos';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import * as Contacts from 'expo-contacts'; // Importa o Contacts

export default function Configuracao({ navigation }) {
  const { session } = useAuth();
  const userEmail = session?.user?.email || 'N/A';

  const [isModalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cuidadores, setCuidadores] = useState([]); // Novo estado para armazenar cuidadores

  useEffect(() => {
    if (session?.user?.id) {
      fetchCuidadores();
    }
  }, [session?.user?.id]);

  const fetchCuidadores = async () => {
    const { data, error } = await supabase
      .from('cuidadores')
      .select('*')
      .eq('idusuario', session.user.id);

    if (error) {
      console.error('Erro ao carregar cuidadores:', error.message);
    } else {
      setCuidadores(data);
    }
  };

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

  // --- Funções para Cuidadores e Contatos ---
  const handleAddCuidador = async () => {
    console.log('Botão "Adicionar Cuidador" pressionado.');
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      console.log('Status da permissão de contatos:', status);

      if (status === 'undetermined') {
        Alert.alert(
          'Permissão Pendente',
          'A permissão para acessar seus contatos ainda não foi concedida ou negada. Por favor, tente novamente e conceda a permissão quando solicitado.'
        );
        return;
      }

      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos da permissão para acessar seus contatos para adicionar um cuidador. Por favor, conceda a permissão nas configurações do seu dispositivo.');
        return;
      }

      // Abre o seletor de contatos
      const contactResult = await Contacts.pickContactAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      if (!contactResult || contactResult.cancelled) {
        console.log('Seleção de contato cancelada ou nenhum contato selecionado.');
        Alert.alert('Ação Cancelada', 'Nenhum contato foi selecionado ou a seleção foi cancelada.');
        return;
      }

      const contact = contactResult;
      const contactName = contact.name;
      const phoneNumber = contact.phoneNumbers?.[0]?.number;

      if (!contactName || !phoneNumber) {
        Alert.alert('Contato Inválido', 'O contato selecionado não possui nome ou número de telefone válido.');
        return;
      }

      Alert.alert(
        'Adicionar Cuidador',
        `Deseja adicionar ${contactName} (${phoneNumber}) como cuidador?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Adicionar',
            onPress: async () => {
              const { error } = await supabase
                .from('cuidadores')
                .insert({
                  idusuario: session.user.id,
                  nome: contactName,
                  telefone: phoneNumber,
                });

              if (error) {
                console.error('Erro ao salvar cuidador no Supabase:', error.message);
                Alert.alert('Erro', 'Não foi possível adicionar o cuidador: ' + error.message);
              } else {
                Alert.alert('Sucesso', `${contactName} foi adicionado como cuidador!`);
                fetchCuidadores(); // Atualiza a lista de cuidadores
              }
            },
          },
        ]
      );

    } catch (error) {
      console.error('Erro inesperado ao adicionar cuidador:', error.message);
      Alert.alert('Erro', 'Ocorreu um erro inesperado ao adicionar o cuidador: ' + error.message);
    }
  };

  const handleViewCuidadores = () => {
    // Implementar navegação para a tela de visualização/gerenciamento de cuidadores
    Alert.alert('Funcionalidade', 'Abrir tela de visualização de Cuidadores');
  };
  // --- Fim das funções para Cuidadores e Contatos ---

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Seção de Conta */}
        <Text style={styles.sectionTitle}>Conta</Text>
        <Pressable style={styles.optionContainer} onPress={() => Alert.alert('Funcionalidade', 'Abrir tela de Editar Perfil')}>
          <Text style={styles.optionIcon}>👤</Text>
          <Text style={styles.optionLabel}>Editar Perfil</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.optionContainer} onPress={() => setModalVisible(true)}>
          <Text style={styles.optionIcon}>🔑</Text>
          <Text style={styles.optionLabel}>Alterar Senha</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.optionContainer} onPress={() => Alert.alert('Funcionalidade', 'Abrir tela de Email')}>
          <Text style={styles.optionIcon}>✉️</Text>
          <Text style={styles.optionLabel}>Email</Text>
          <Text style={styles.optionValue}>{userEmail}</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>

        {/* Seção de Preferências */}
        <Text style={styles.sectionTitle}>Preferências</Text>
        <Pressable style={styles.optionContainer} onPress={() => Alert.alert('Funcionalidade', 'Abrir tela de Tema')}>
          <Text style={styles.optionIcon}>🌙</Text>
          <Text style={styles.optionLabel}>Tema</Text>
          <Text style={styles.optionValue}>Claro</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.optionContainer} onPress={() => Alert.alert('Funcionalidade', 'Abrir tela de Notificações')}>
          <Text style={styles.optionIcon}>🔔</Text>
          <Text style={styles.optionLabel}>Notificações</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.optionContainer} onPress={() => Alert.alert('Funcionalidade', 'Abrir tela de Unidades de Medida')}>
          <Text style={styles.optionIcon}>📏</Text>
          <Text style={styles.optionLabel}>Unidades de Medida</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>

        {/* Seção de Privacidade e Bem-Estar */}
        <Text style={styles.sectionTitle}>Privacidade e Bem-Estar</Text>
        <Pressable style={styles.optionContainer} onPress={() => Alert.alert('Funcionalidade', 'Abrir tela de Privacidade dos dados')}>
          <Text style={styles.optionIcon}>🛡️</Text>
          <Text style={styles.optionLabel}>Privacidade dos dados</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.optionContainer} onPress={handleViewCuidadores}>
          <Text style={styles.optionIcon}>👥</Text>
          <Text style={styles.optionLabel}>Cuidadores e Responsáveis</Text>
          <Text style={styles.optionArrow}>›</Text>
        </Pressable>
        {/* Botão para adicionar um novo cuidador */}
        <TouchableOpacity style={styles.addCuidadorButton} onPress={handleAddCuidador}>
          <Text style={styles.addCuidadorButtonText}>+ Adicionar Cuidador</Text>
        </TouchableOpacity>

        {/* Botão de Sair da conta (mantido, mas pode ser movido para outro lugar se não for parte do design) */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Alterar Senha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(!isModalVisible)}
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