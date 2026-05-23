// PetPreviewCard component — real-time preview of the pet registration form
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

        {data.idade ? (
          <View style={styles.detalheItem}>
            <Ionicons name="calendar" size={16} color={Colors.secondary} />
            <Text style={styles.detalheLabel}>Idade</Text>
            <Text style={styles.detalheValue}>{data.idade} ano{Number(data.idade) > 1 ? 's' : ''}</Text>
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
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    boxShadow: '0px 4px 12px rgba(108,99,255,0.1)',
    elevation: 3,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
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
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  raca: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  detalhes: {
    gap: 8,
  },
  detalheItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  detalheLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  detalheValue: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 'auto',
  },
  obsContainer: {
    marginTop: 10,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 10,
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
