// Componente PetPreviewCard — Preview em tempo real do formulário de cadastro
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { FormDataPet } from '../types';

interface PetPreviewCardProps {
  data: FormDataPet;
}

export default function PetPreviewCard({ data }: PetPreviewCardProps) {
  const temDados = data.nome || data.raca || data.peso;

  if (!temDados) {
    return (
      <View style={styles.emptyCard}>
        <Ionicons name="paw" size={32} color={Colors.border} />
        <Text style={styles.emptyText}>
          Preencha os campos acima para ver o preview do pet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons
            name={data.especie === 'gato' ? 'fish' : 'paw'}
            size={28}
            color={Colors.surface}
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.nome}>{data.nome || 'Nome do pet'}</Text>
          <Text style={styles.raca}>{data.raca || 'Raça'}</Text>
        </View>
      </View>

      <View style={styles.detalhes}>
        <View style={styles.detalheItem}>
          <Ionicons name="paw" size={16} color={Colors.primary} />
          <Text style={styles.detalheLabel}>Espécie</Text>
          <Text style={styles.detalheValue}>
            {data.especie === 'cachorro' ? '🐕 Cachorro' : '🐈 Gato'}
          </Text>
        </View>

        {data.nascimento ? (
          <View style={styles.detalheItem}>
            <Ionicons name="calendar" size={16} color={Colors.secondary} />
            <Text style={styles.detalheLabel}>Nascimento</Text>
            <Text style={styles.detalheValue}>{data.nascimento}</Text>
          </View>
        ) : null}

        {data.peso ? (
          <View style={styles.detalheItem}>
            <Ionicons name="barbell" size={16} color={Colors.accent} />
            <Text style={styles.detalheLabel}>Peso</Text>
            <Text style={styles.detalheValue}>{data.peso} kg</Text>
          </View>
        ) : null}
      </View>

      {data.observacoes ? (
        <View style={styles.obsContainer}>
          <Text style={styles.obsLabel}>📝 Observações</Text>
          <Text style={styles.obsText}>{data.observacoes}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    // Sombra
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 30,
    marginTop: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    marginLeft: 14,
    flex: 1,
  },
  nome: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  raca: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  detalhes: {
    gap: 8,
  },
  detalheItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  detalheLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  detalheValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 'auto',
  },
  obsContainer: {
    marginTop: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
  },
  obsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  obsText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
});
