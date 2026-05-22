import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background, height: 65 },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          tabBarLabel: 'Pets',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="paw" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="atividades"
        options={{
          tabBarLabel: 'Atividades',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="walk" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="progresso"
        options={{
          tabBarLabel: 'Progresso',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
