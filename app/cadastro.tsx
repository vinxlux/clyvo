import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import PetPreviewCard from '../components/PetPreviewCard';
import { adicionarPet } from '../storage/storage';
import { FormDataPet } from '../types';
import { Colors } from '../constants/colors';

export default function Cadastro() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataPet>({
    nome: '',
    raca: '',
    especie: 'cachorro',
    nascimento: '',
    peso: '',
    observacoes: '',
  });

  function updateField<K extends keyof FormDataPet>(key: K, value: FormDataPet[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }
    // criar pet e salvar
    await adicionarPet({
      id: Date.now().toString(),
      nome: formData.nome,
      raca: formData.raca,
      especie: formData.especie,
      nascimento: formData.nascimento,
      peso: Number(formData.peso) || 0,
      foto: 'https://placedog.net/300/300',
      observacoes: formData.observacoes,
    } as any);
    router.push('/(tabs)/pets');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Pet</Text>

      <TextInput placeholder="Nome" value={formData.nome} onChangeText={t => updateField('nome', t)} style={styles.input} />
      <TextInput placeholder="Raça" value={formData.raca} onChangeText={t => updateField('raca', t)} style={styles.input} />

      <View style={styles.rowButtons}>
        <TouchableOpacity style={[styles.specButton, formData.especie === 'cachorro' && styles.specActive]} onPress={() => updateField('especie', 'cachorro')}>
          <Text style={styles.specText}>Cachorro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.specButton, formData.especie === 'gato' && styles.specActive]} onPress={() => updateField('especie', 'gato')}>
          <Text style={styles.specText}>Gato</Text>
        </TouchableOpacity>
      </View>

      <TextInput placeholder="Nascimento (YYYY-MM-DD)" value={formData.nascimento} onChangeText={t => updateField('nascimento', t)} style={styles.input} />
      <TextInput placeholder="Peso (kg)" value={formData.peso} onChangeText={t => updateField('peso', t)} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Observações" value={formData.observacoes} onChangeText={t => updateField('observacoes', t)} style={[styles.input, { height: 100 }]} multiline />

      <PetPreviewCard data={formData} />

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Salvar Pet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn} onPress={() => setFormData({ nome: '', raca: '', especie: 'cachorro', nascimento: '', peso: '', observacoes: '' })}>
          <Text style={styles.clearText}>Limpar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: Colors.surface, padding: 10, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  rowButtons: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  specButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: Colors.background },
  specActive: { backgroundColor: Colors.primaryLight },
  specText: { fontWeight: '700' },
  saveBtn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10 },
  saveText: { color: '#fff', fontWeight: '700' },
  clearBtn: { backgroundColor: Colors.background, padding: 12, borderRadius: 10 },
  clearText: { fontWeight: '700' },
});
