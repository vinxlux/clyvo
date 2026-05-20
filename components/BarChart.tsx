// Componente BarChart — Gráfico de barras semanal feito com Views
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface BarChartProps {
  dados: number[];
  dias?: string[];
  maxHeight?: number;
  cor?: string;
}

const DIAS_PADRAO = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

// Componente de barra individual animada
function BarraAnimada({ valor, maxValue, maxHeight, cor, delay }: {
  valor: number;
  maxValue: number;
  maxHeight: number;
  cor: string;
  delay: number;
}) {
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: maxValue > 0 ? (valor / maxValue) * maxHeight : 0,
      duration: 600,
      delay,
      useNativeDriver: false,
    }).start();
  }, [valor, maxValue]);

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          height: heightAnim,
          backgroundColor: cor,
        },
      ]}
    />
  );
}

export default function BarChart({
  dados,
  dias = DIAS_PADRAO,
  maxHeight = 120,
  cor = Colors.primary,
}: BarChartProps) {
  // Altura proporcional ao valor máximo da semana
  const maxValue = Math.max(...dados, 1);

  return (
    <View style={styles.container}>
      <View style={[styles.chartArea, { height: maxHeight }]}>
        {dados.map((valor, i) => (
          <View key={i} style={styles.barWrapper}>
            <View style={styles.barContainer}>
              <Text style={styles.valor}>{valor}</Text>
              <BarraAnimada
                valor={valor}
                maxValue={maxValue}
                maxHeight={maxHeight - 24}
                cor={i === new Date().getDay() - 1 ? Colors.secondary : cor}
                delay={i * 80}
              />
            </View>
            <Text style={styles.label}>{dias[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  bar: {
    width: 28,
    borderRadius: 8,
    minHeight: 4,
  },
  valor: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
});
