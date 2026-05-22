import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Clyvo</Text>
      <Text style={styles.subtitle}>Tela inicial restaurada</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { marginTop: 8, color: colors.textSecondary },
});
