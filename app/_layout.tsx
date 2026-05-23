import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import ErrorBoundary from '../components/ErrorBoundary';
// import { useRouter } from 'expo-router'; // not used // not needed
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// removed duplicate import
import { inicializarDados } from '../storage/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [autenticado, setAutenticado] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      // Check the existing login flag
      const flag = await AsyncStorage.getItem('@clyvo:loggedIn');
      const ok = flag === 'true';
      setAutenticado(ok);
    })();
  }, []);

  // The conditional layout below already chooses which stack to render

  useEffect(() => {
    // Initialize mock data on first run
    inicializarDados();
  }, []);
  if (autenticado === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }
  // Log the authentication status to the console
  if (autenticado !== null) {
    console.log(autenticado ? '✅ Usuário já está logado' : '⚠️ Usuário não está logado – redirecionando para login');
  }

  // Debug button to clear the login flag in development mode
  const clearLogin = async () => {
    await AsyncStorage.removeItem('@clyvo:loggedIn');
    console.log('🗑️ Flag de login removida');
    setAutenticado(false);
  };
  const debugButton = (process.env.NODE_ENV === 'development') ? (
    <View style={{ padding: 8, backgroundColor: '#fff' }}>
      <TouchableOpacity onPress={clearLogin} style={{ backgroundColor: '#ff6b6b', padding: 8, borderRadius: 4 }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Reset login (dev)</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  return (
    <>
      {debugButton}
      <ErrorBoundary>
        {autenticado ? (
          <>
            {/* Usuário autenticado: rotas da aplicação */}
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="pet/[id]" options={{ title: 'Detalhes do Pet' }} />
              <Stack.Screen name="cadastro" options={{ title: 'Cadastrar Pet' }} />
            </Stack>
          </>
        ) : (
          <>
            {/* Não autenticado: renderiza AuthScreen diretamente como fallback seguro */}
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack>
          </>
        )}
      </ErrorBoundary>
    </>
  );
}

const styles = StyleSheet.create({
  debugBar: { position: 'absolute', right: 16, bottom: 24 },
  debugBtn: { backgroundColor: '#ff6b6b', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  debugText: { color: '#fff', fontWeight: '700' },
});
