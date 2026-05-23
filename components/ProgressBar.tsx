// ProgressBar component — animated progress bar
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface ProgressBarProps {
  percentual: number; // 0 to 100
  label?: string;
  cor?: string;
  height?: number;
}

export default function ProgressBar({
  percentual,
  label,
  cor = Colors.primary,
  height = 10,
}: ProgressBarProps) {
  // Animated.Value to animate the width
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentual,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentual]);

  // Interpolate the value to a percentage
  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.percentText}>{Math.round(percentual)}%</Text>
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: animatedWidth,
              backgroundColor: cor,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  track: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 6,
  },
});
