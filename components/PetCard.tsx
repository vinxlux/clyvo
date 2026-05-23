// Componente PetCard — Card de pet para a lista
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
}

// Calcula a idade do pet a partir da data de nascimento
function calcularIdade(idade: number): string {
  if (!idade || idade <= 0) return 'Filhote';
  return `${idade} ano${idade > 1 ? 's' : ''}`;
}

export default function PetCard({ pet, onPress }: PetCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: pet.foto }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.nome}>{pet.nome}</Text>
        <Text style={styles.raca}>
          {pet.raca} · {calcularIdade(pet.idade)}
        </Text>
        <View style={styles.badge}>
          <Ionicons
            name={pet.especie === 'cachorro' ? 'paw' : 'fish'}
            size={12}
            color={Colors.primary}
          />
          <Text style={styles.badgeText}>
            {pet.especie === 'cachorro' ? 'Cachorro' : 'Gato'}
          </Text>
        </View>
      </View>
      <View style={styles.btnDetalhes}>
        <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(108,99,255,0.08)',
    elevation: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  nome: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  raca: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 5,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  btnDetalhes: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 8,
  },
});
