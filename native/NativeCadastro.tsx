import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { adicionarPet, getFotoPorEspecie } from '../storage/storage';
import { Pet } from '../types';

export default function NativeCadastro({ onDone, onCancel, pet }: { onDone: () => void; onCancel: () => void; pet?: any }) {
  const [nome, setNome] = useState(pet?.nome || '');
  const [raca, setRaca] = useState('');
  const [especie, setEspecie] = useState<'cachorro'|'gato'>(pet?.especie || 'cachorro');
  const [idade, setIdade] = useState(String(pet?.idade || ''));
  const [peso, setPeso] = useState(String(pet?.peso || ''));
  const [observacoes, setObservacoes] = useState(pet?.observacoes || '');
  const [atividadesHoje, setAtividadesHoje] = useState<string[] | null>(null);

  useEffect(() => {
    // load a quick preview of today's activities for context while adding a pet
    (async () => {
      try {
        const { carregarAtividades } = await require('../storage/storage');
        const a = await carregarAtividades();
        const today = new Date().toISOString().split('T')[0];
        setAtividadesHoje(a.filter((it: any) => it.data === today).map((it: any) => it.titulo));
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  async function handleSave() {
    if (!nome.trim()) return Alert.alert('Erro', 'Nome é obrigatório');
    const novo: Pet = {
      id: pet?.id || Date.now().toString(),
      nome: nome.trim(),
      raca: raca || 'Desconhecida',
      especie,
      idade: Number(idade) || 0,
      peso: Number(peso) || 0,
      foto: getFotoPorEspecie(especie),
      observacoes: observacoes || '',
    };
    try {
      // If editing existing pet, call atualizarPet
      if (pet && pet.id) {
        const { atualizarPet } = await require('../storage/storage');
        await atualizarPet(novo);
      } else {
        await adicionarPet(novo);
      }
      onDone();
    } catch (e) {
      console.error('NativeCadastro: erro ao salvar', e);
      Alert.alert('Erro', 'Falha ao salvar pet');
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={onCancel} style={{ padding: 8 }}>
          <Text style={{ color: Colors.primary, fontWeight: '700' }}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cadastrar Pet</Text>
        <View style={{ width: 56 }} />
      </View>

      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Raça" value={raca} onChangeText={setRaca} style={styles.input} />

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <TouchableOpacity onPress={() => setEspecie('cachorro')} style={[styles.specBtn, especie === 'cachorro' && styles.specActive]}>
          <Text style={{ fontWeight: '700' }}>Cachorro</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEspecie('gato')} style={[styles.specBtn, especie === 'gato' && styles.specActive]}>
          <Text style={{ fontWeight: '700' }}>Gato</Text>
        </TouchableOpacity>
      </View>

      <TextInput placeholder="Idade" value={idade} onChangeText={setIdade} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Peso" value={peso} onChangeText={setPeso} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Observações" value={observacoes} onChangeText={setObservacoes} style={[styles.input, { height: 100 }]} multiline />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Salvar</Text>
      </TouchableOpacity>

      {atividadesHoje && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Atividades de hoje</Text>
          {atividadesHoje.length === 0 ? <Text style={{ fontStyle: 'italic' }}>Nenhuma atividade</Text> : atividadesHoje.map((t, i) => <Text key={i}>• {t}</Text>)}
        </View>
      )}
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: Colors.surface, padding: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  saveBtn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  specBtn: { padding: 8, backgroundColor: Colors.background, borderRadius: 8 },
  specActive: { backgroundColor: Colors.primaryLight },
});
