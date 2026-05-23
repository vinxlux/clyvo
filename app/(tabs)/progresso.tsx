import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import MetricCard from '../../components/MetricCard';
import BarChart from '../../components/BarChart';
import ProgressBar from '../../components/ProgressBar';

// Mocked weekly metric data
const metricData = [
  { titulo: 'Dias ativos', valor: '4', icone: 'calendar', cor: Colors.primary },
  { titulo: 'Atividades concluídas', valor: '12', icone: 'checkmark-circle', cor: Colors.success },
  { titulo: 'Metas batidas', valor: '3', icone: 'trophy', cor: Colors.accent },
];

// Mocked bar chart data (weight over the week)
const barData = [28, 29, 28.5, 28, 27.8, 28.2, 28];
const barDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

// Mocked badges
const badges = [
  { id: '1', label: 'Primeira caminhada', icon: 'walk' },
  { id: '2', label: 'Meta de peso', icon: 'weight' },
  { id: '3', label: 'Alimentação saudável', icon: 'restaurant' },
];

export default function ProgressoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Métricas da semana */}
      <View style={styles.metricRow}>
        {metricData.map(m => (
          <MetricCard key={m.titulo} titulo={m.titulo} valor={m.valor} icone={m.icone as any} cor={m.cor} />
        ))}
      </View>

      {/* Gráfico de peso semanal */}
      <Text style={styles.sectionTitle}>Peso da semana</Text>
      <BarChart dados={barData} dias={barDays} cor={Colors.primary} />

      {/* Metas da semana */}
      <Text style={styles.sectionTitle}>Metas da semana</Text>
      <ProgressBar percentual={75} label="Meta de atividade" cor={Colors.accent} height={12} />

      {/* Conquistas / Badges */}
      <Text style={styles.sectionTitle}>Conquistas</Text>
      <FlatList
        data={badges}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.badgeList}
        renderItem={({ item }) => (
          <View style={styles.badgeItem}>
            <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
            <Text style={styles.badgeLabel}>{item.label}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: 16 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8, marginTop: 16 },
  badgeList: { gap: 12 },
  badgeItem: { alignItems: 'center', backgroundColor: Colors.surface, padding: 12, borderRadius: 12, elevation: 2 },
  badgeLabel: { marginTop: 4, fontSize: 12, color: Colors.textSecondary },
});
