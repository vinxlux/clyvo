import React from 'react';
import { Stack } from 'expo-router';
import ErrorBoundary from '../components/ErrorBoundary';

import { useEffect } from 'react';
import { inicializarDados } from '../storage/storage';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      {/* Stack raiz — grupos e telas filhas serão resolvidas pelo expo-router */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="pet/[id]" options={{ title: 'Detalhes do Pet' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Cadastrar Pet' }} />
      </Stack>
    </ErrorBoundary>
  );
}
