// Componente AtividadeItem — Item de atividade na lista
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Atividade } from '../types';

interface AtividadeItemProps {
  atividade: Atividade;
  onToggle: (id: string) => void;
  petName?: string;
}

// Mapeia tipo para ícone e cor
function getIconeAtividade(tipo: Atividade['tipo']): { nome: string; cor: string } {
  switch (tipo) {
    case 'exercicio':
      return { nome: 'walk', cor: Colors.primary };
    case 'alimentacao':
      return { nome: 'restaurant', cor: Colors.secondary };
    case 'saude':
      return { nome: 'medkit', cor: Colors.accent };
    case 'higiene':
      return { nome: 'water', cor: '#5B9BD5' };
    default:
      return { nome: 'ellipse', cor: Colors.textSecondary };
  }
}

// Mapeia tipo para label
function getLabelTipo(tipo: Atividade['tipo']): string {
  switch (tipo) {
    case 'exercicio': return 'Exercício';
    case 'alimentacao': return 'Alimentação';
    case 'saude': return 'Saúde';
    case 'higiene': return 'Higiene';
    default: return tipo;
  }
}

export default function AtividadeItem({ atividade, onToggle, petName }: AtividadeItemProps) {
  const icone = getIconeAtividade(atividade.tipo);

  return (
    <View style={[styles.card, atividade.concluida && styles.cardConcluida]}>
      <View style={[styles.iconContainer, { backgroundColor: icone.cor + '18' }]}>
        <Ionicons name={icone.nome as any} size={22} color={icone.cor} />
      </View>

      <View style={styles.info}>
        <Text style={[styles.titulo, atividade.concluida && styles.tituloConcluido]}>
          {atividade.titulo}
        </Text>
        {petName ? <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 4 }}>{petName}</Text> : null}
        <View style={styles.metaRow}>
          <Text style={styles.tipo}>{getLabelTipo(atividade.tipo)}</Text>
          <Text style={styles.horario}>
            <Ionicons name="time-outline" size={11} color={Colors.textSecondary} />{' '}
            {atividade.horario}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.checkBtn, atividade.concluida && styles.checkBtnConcluido]}
        onPress={() => onToggle(atividade.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={atividade.concluida ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={atividade.concluida ? Colors.success : Colors.border}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    boxShadow: '0px 2px 8px rgba(108,99,255,0.06)',
    elevation: 3,
  },
  cardConcluida: {
    opacity: 0.7,
    backgroundColor: '#F0FFF0',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tituloConcluido: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 10,
  },
  tipo: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  horario: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  checkBtn: {
    padding: 4,
  },
  checkBtnConcluido: {
    transform: [{ scale: 1.1 }],
  },
});
