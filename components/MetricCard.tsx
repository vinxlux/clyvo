// Componente MetricCard — Card de métrica para a tela de progresso
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface MetricCardProps {
  titulo: string;
  valor: string | number;
  icone: string;
  cor?: string;
  subtitulo?: string;
}

export default function MetricCard({
  titulo,
  valor,
  icone,
  cor = Colors.primary,
  subtitulo,
}: MetricCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: cor + '18' }]}>
        <Ionicons name={icone as any} size={22} color={cor} />
      </View>
      <Text style={styles.valor}>{valor}</Text>
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 3px 10px rgba(108,99,255,0.07)',
    elevation: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  valor: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  titulo: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
