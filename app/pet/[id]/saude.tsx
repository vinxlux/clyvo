import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';

export default function SaudeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saúde do pet</Text>
      <Text style={styles.body}>Informações de saúde, vacinas, check‑ups e outros dados relevantes serão exibidos aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  title: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  body: { fontSize: 14, color: Colors.textSecondary },
});