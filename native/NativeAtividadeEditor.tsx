import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Colors } from '../constants/colors';
import { Atividade, Pet } from '../types';

export default function NativeAtividadeEditor({
  atividade,
  pets,
  onDone,
  onCancel,
  onDelete,
}: {
  atividade: Atividade;
  pets: Pet[];
  onDone: (a: Atividade) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}) {
  const [titulo, setTitulo] = useState(atividade.titulo || '');
  const [horario, setHorario] = useState(atividade.horario || '');
  const [data, setData] = useState(atividade.data || new Date().toISOString().split('T')[0]);
  const [tipo, setTipo] = useState<Atividade['tipo']>(atividade.tipo || 'exercicio');
  const [petId, setPetId] = useState(atividade.petId || pets[0]?.id || '');

  function handleSave() {
    if (!titulo.trim()) return Alert.alert('Erro', 'Título é obrigatório');
    if (!petId) return Alert.alert('Erro', 'Selecione um pet');

    const parsedDate = new Date(data);
    if (Number.isNaN(parsedDate.getTime())) {
      return Alert.alert('Erro', 'Data inválida. Use o formato YYYY-MM-DD');
    }

    const updated: Atividade = { ...atividade, titulo: titulo.trim(), horario, tipo, data, petId };
    onDone(updated);
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar Atividade</Text>
        <View style={styles.headerSpacer} />
      </View>

      <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput placeholder="Horário (ex: 08:00)" value={horario} onChangeText={setHorario} style={styles.input} />
      <TextInput placeholder="Data (YYYY-MM-DD)" value={data} onChangeText={setData} style={styles.input} autoCapitalize="none" />

      <Text style={styles.sectionLabel}>Pet</Text>
      <View style={styles.petRow}>
        {pets.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setPetId(item.id)}
            style={[styles.typeBtn, petId === item.id && styles.typeActive]}
          >
            <Text style={[styles.typeText, petId === item.id && styles.typeTextActive]}>{item.nome}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Tipo</Text>
      <View style={styles.typeRow}>
        {(['exercicio', 'alimentacao', 'saude', 'higiene'] as Atividade['tipo'][]).map(t => (
          <TouchableOpacity key={t} onPress={() => setTipo(t)} style={[styles.typeBtn, tipo === t && styles.typeActive]}>
            <Text style={[styles.typeText, tipo === t && styles.typeTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(atividade.id)}>
        <Text style={styles.deleteText}>Excluir</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerButton: { paddingVertical: 8, paddingHorizontal: 4 },
  headerButtonText: { color: Colors.primary, fontWeight: '700' },
  headerSpacer: { width: 56 },
  title: { fontSize: 20, fontWeight: '700' },
  input: { backgroundColor: Colors.surface, padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  sectionLabel: { fontSize: 14, fontWeight: '700', marginTop: 4, marginBottom: 8 },
  petRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: Colors.background },
  typeActive: { backgroundColor: Colors.primaryLight },
  typeText: { fontWeight: '700' },
  typeTextActive: { color: Colors.primary },
  saveBtn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
  deleteBtn: { backgroundColor: Colors.error, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  deleteText: { color: '#fff', fontWeight: '700' },
});
