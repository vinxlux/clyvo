import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '../constants/colors';
import { Atividade } from '../types';

export default function NativeAtividadeEditor({ atividade, onDone, onCancel, onDelete }: { atividade: Atividade; onDone: (a: Atividade) => void; onCancel: () => void; onDelete: (id: string) => void }) {
  const [titulo, setTitulo] = useState(atividade.titulo || '');
  const [horario, setHorario] = useState(atividade.horario || '');
  const [tipo, setTipo] = useState<Atividade['tipo']>(atividade.tipo || 'exercicio');

  function handleSave() {
    if (!titulo.trim()) return Alert.alert('Erro', 'Título é obrigatório');
    const updated: Atividade = { ...atividade, titulo: titulo.trim(), horario, tipo };
    onDone(updated);
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={{ color: Colors.primary, fontWeight: '700' }}>Voltar</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Editar Atividade</Text>
        <View style={{ width: 56 }} />
      </View>

      <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput placeholder="Horário" value={horario} onChangeText={setHorario} style={styles.input} />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['exercicio','alimentacao','saude','higiene'] as Atividade['tipo'][]).map(t => (
          <TouchableOpacity key={t} onPress={() => setTipo(t)} style={[styles.typeBtn, tipo === t && styles.typeActive]}>
            <Text style={{ fontWeight: '700' }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.saveBtn, { marginTop: 12 }]} onPress={handleSave}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.deleteBtn, { marginTop: 8 }]} onPress={() => onDelete(atividade.id)}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: Colors.surface, padding: 12, borderRadius: 10, marginBottom: 8 },
  saveBtn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, alignItems: 'center' },
  deleteBtn: { backgroundColor: Colors.error, padding: 12, borderRadius: 10, alignItems: 'center' },
  typeBtn: { padding: 8, backgroundColor: Colors.background, borderRadius: 8 },
  typeActive: { backgroundColor: Colors.primaryLight },
});
