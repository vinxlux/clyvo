import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // You can log the error to an error reporting service here
    // console.error(error);
    // If this is the known expo-router web issue, mark it so App can render a web fallback
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && error?.message?.includes('contextModule')) {
        try {
          window.localStorage.setItem('@clyvo:expoRouterFailed', 'true');
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }
    this.setState({ error });
  }

  handleReload = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
      window.location.reload();
    } else if ((globalThis as any).Expo && (globalThis as any).Expo.Updates && (globalThis as any).Expo.Updates.reloadAsync) {
      (globalThis as any).Expo.Updates.reloadAsync();
    } else {
      // As a fallback, try to throw to let dev tools catch it
      console.log('Please reload the app');
    }
  };

  render() {
    if (this.state.hasError) {
      // If this is the known expo-router web issue where contextModule is undefined,
      // render the Auth screen as a safe fallback so the user can still log in.
      if (Platform.OS === 'web' && this.state.error?.message?.includes('contextModule')) {
        try {
          // require the auth screen directly to avoid router dependency
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const AuthScreen = require('../app/auth').default;
          return React.createElement(AuthScreen);
        } catch {
          // fallthrough to generic error UI
        }
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Ocorreu um erro inesperado</Text>
          <Text style={styles.message}>{this.state.error?.message || 'Erro interno'}</Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReload}>
            <Text style={styles.buttonText}>Recarregar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  message: { color: '#666', marginBottom: 16, textAlign: 'center' },
  button: { backgroundColor: '#6C63FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
