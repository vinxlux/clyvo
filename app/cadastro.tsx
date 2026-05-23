import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import PetPreviewCard from '../components/PetPreviewCard';
import { adicionarPet } from '../storage/storage';
import { buscarPetPorId, atualizarPet, excluirPet, getFotoPorEspecie } from '../storage/storage';
import { FormDataPet } from '../types';
import { Colors } from '../constants/colors';

export default function Cadastro() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataPet>({
    nome: '',
    raca: '',
    especie: 'cachorro',
    idade: '',
    peso: '',
    observacoes: '',
  });
  const { id } = useLocalSearchParams();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmName, setConfirmName] = useState('');

  useEffect(() => {
    (async () => {
      if (id) {
        const p = await buscarPetPorId(String(id));
        if (p) {
          setFormData({ nome: p.nome, raca: p.raca, especie: p.especie, idade: String(p.idade), peso: String(p.peso), observacoes: p.observacoes || '' });
        }
      }
    })();
  }, [id]);

  function updateField<K extends keyof FormDataPet>(key: K, value: FormDataPet[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }
    // criar pet e salvar
    if (id) {
      await atualizarPet({
        id: String(id),
        nome: formData.nome,
        raca: formData.raca,
        especie: formData.especie,
        idade: Number(formData.idade) || 0,
        peso: Number(formData.peso) || 0,
        foto: getFotoPorEspecie(formData.especie as any),
        observacoes: formData.observacoes,
      } as any);
    } else {
      await adicionarPet({
        id: Date.now().toString(),
        nome: formData.nome,
        raca: formData.raca,
        especie: formData.especie,
        idade: Number(formData.idade) || 0,
        peso: Number(formData.peso) || 0,
        foto: getFotoPorEspecie(formData.especie as any),
        observacoes: formData.observacoes,
      } as any);
    }
    router.push('/(tabs)/pets');
  }

  async function handleDelete() {
    if (!id) return;
    if (confirmName !== formData.nome) {
      Alert.alert('Erro', 'O nome digitado não corresponde ao pet');
      return;
    }
    await excluirPet(String(id));
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

      <TextInput placeholder="Idade (anos)" value={formData.idade} onChangeText={t => updateField('idade', t)} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Peso (kg)" value={formData.peso} onChangeText={t => updateField('peso', t)} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Observações" value={formData.observacoes} onChangeText={t => updateField('observacoes', t)} style={[styles.input, { height: 100 }]} multiline />

      <PetPreviewCard data={formData} />

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Salvar Pet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn} onPress={() => setFormData({ nome: '', raca: '', especie: 'cachorro', idade: '', peso: '', observacoes: '' })}>
          <Text style={styles.clearText}>Limpar</Text>
        </TouchableOpacity>
        {id ? (
          <TouchableOpacity style={[styles.clearBtn, { backgroundColor: Colors.error }]} onPress={() => setShowDeleteConfirm(s => !s)}>
            <Text style={styles.clearText}>Excluir</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {showDeleteConfirm ? (
        <View style={{ marginTop: 12 }}>
          <Text style={{ marginBottom: 8 }}>Digite o nome do pet para confirmar exclusão:</Text>
          <TextInput placeholder="Nome do pet" value={confirmName} onChangeText={setConfirmName} style={styles.input} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: Colors.error }]} onPress={handleDelete} disabled={confirmName !== formData.nome}>
              <Text style={styles.saveText}>Confirmar exclusão</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearBtn} onPress={() => { setShowDeleteConfirm(false); setConfirmName(''); }}>
              <Text style={styles.clearText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
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
