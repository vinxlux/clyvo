import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Progresso() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progresso (a implementar)</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 18, fontWeight: '700' } });
