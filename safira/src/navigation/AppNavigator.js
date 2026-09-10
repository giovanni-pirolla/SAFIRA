import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import Formulario1 from '../screens/Formulario1';
import Formulario2 from '../screens/Formulario2';
import Formulario3 from '../screens/Formulario3';
import Formulario4 from '../screens/Formulario4';
import TelaInicial from '../screens/TelaInicial';
import Historico from '../screens/Historico';
import Dispositivos from '../screens/Dispositivos';
import AddDispositivo from '../screens/AddDispositivo';
import Perfil from '../screens/Perfil';
import Configuracao from '../screens/Configuracao';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { session, carregando } = useAuth();
  const [formularioPreenchido, setFormularioPreenchido] = useState(null);

  useEffect(() => {
    async function verificarFormulario() {
      if (session && session.user) {
        const { data, error } = await supabase
          .from('usuario')
          .select('formulario_preenchido')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar status do formulário:', error.message);
          setFormularioPreenchido(false);
        } else {
          setFormularioPreenchido(data?.formulario_preenchido || false);
        }
      } else if (session === null) {
        setFormularioPreenchido(false);
      }
    }

    verificarFormulario();
  }, [session]);

  if (carregando || (session && formularioPreenchido === null)) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={formularioPreenchido ? 'TelaInicial' : 'Formulario1'}
        screenOptions={{ headerShown: false }}
      >
        {session ? (
          <>
            <Stack.Screen name="TelaInicial" component={TelaInicial} />

            <Stack.Screen name="Formulario1" component={Formulario1} />
            <Stack.Screen name="Formulario2" component={Formulario2} />
            <Stack.Screen name="Formulario3" component={Formulario3} />
            <Stack.Screen name="Formulario4" component={Formulario4} />

            <Stack.Screen name="Historico" component={Historico} />
            <Stack.Screen name="Dispositivos" component={Dispositivos} />
            <Stack.Screen name="AddDispositivo" component={AddDispositivo} />
            <Stack.Screen name="Perfil" component={Perfil} />
            <Stack.Screen name="Configuracao" component={Configuracao} />
          </>
        ) : (
          <>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}