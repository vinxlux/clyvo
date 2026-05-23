import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import ErrorBoundary from '../components/ErrorBoundary';

// removed duplicate import
import { inicializarDados } from '../storage/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [autenticado, setAutenticado] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      const flag = await AsyncStorage.getItem('@clyvo:loggedIn');
      setAutenticado(flag === 'true');
    })();
  }, []);

  useEffect(() => {
    // Inicializa dados mockados na primeira execução
    inicializarDados();
  }, []);
  if (autenticado === null) {
    return null; // ou spinner
  }
  return (
    <ErrorBoundary>
      <Stack>
        {autenticado ? (
          {/* Usuário autenticado: rotas da aplicação */}
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="pet/[id]" options={{ title: 'Detalhes do Pet' }} />
            <Stack.Screen name="cadastro" options={{ title: 'Cadastrar Pet' }} />
          </>
        ) : (
          {/* Não autenticado: tela de login e registro */}
          <>
            <Stack.Screen name="login" options={{ title: 'Login' }} />
            <Stack.Screen name="registro" options={{ title: 'Cadastro' }} />
          </>
        )}
      </Stack>
    </ErrorBoundary>
  );
}
