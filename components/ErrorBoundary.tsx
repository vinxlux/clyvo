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
    this.setState({ error });
  }

  handleReload = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
      window.location.reload();
    } else if ((global as any).Expo && (global as any).Expo.Updates && (global as any).Expo.Updates.reloadAsync) {
      (global as any).Expo.Updates.reloadAsync();
    } else {
      // As a fallback, try to throw to let dev tools catch it
      console.log('Please reload the app');
    }
  };

  render() {
    if (this.state.hasError) {
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
