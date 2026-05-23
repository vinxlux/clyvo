import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { carregarPets, adicionarPet, excluirPet } from '../storage/storage';
import { Pet } from '../types';
import PetCard from './PetCard';
import { Colors } from '../constants/colors';

export default function PetsManager() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [especie, setEspecie] = useState<'cachorro' | 'gato'>('cachorro');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const p = await carregarPets();
    setPets(p);
  }

  async function handleAdd() {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Informe o nome do pet');
      return;
    }
    const novo: Pet = {
      id: Date.now().toString(),
      nome: nome.trim(),
      raca: raca || 'Raça desconhecida',
      especie,
      nascimento: new Date().toISOString().split('T')[0],
      peso: 1,
      foto: 'https://placedog.net/300/300',
      observacoes: '',
    };
    await adicionarPet(novo);
    setNome('');
    setRaca('');
    load();
  }

  function confirmDelete(id: string) {
    Alert.alert('Confirmar', 'Excluir este pet?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => handleDelete(id) },
    ]);
  }

  async function handleDelete(id: string) {
    const novos = await excluirPet(id);
    setPets(novos);
  }

  return (
    <View>
      <Text style={styles.title}>Gerenciar Pets</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <TextInput
          placeholder="Raça"
          value={raca}
          onChangeText={setRaca}
          style={styles.input}
        />
        <View style={styles.rowButtons}>
          <TouchableOpacity
            style={[styles.specButton, especie === 'cachorro' && styles.specActive]}
            onPress={() => setEspecie('cachorro')}
          >
            <Text style={styles.specText}>Cachorro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.specButton, especie === 'gato' && styles.specActive]}
            onPress={() => setEspecie('gato')}
          >
            <Text style={styles.specText}>Gato</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={pets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <PetCard pet={item} onPress={() => {}} />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => confirmDelete(item.id)}
            >
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  form: { marginBottom: 12 },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowButtons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  specButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  specActive: { backgroundColor: Colors.primaryLight },
  specText: { color: Colors.textPrimary, fontWeight: '600' },
  addBtn: {
    marginLeft: 'auto',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addText: { color: '#fff', fontWeight: '700' },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  deleteBtn: {
    marginLeft: 8,
    backgroundColor: Colors.error,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  deleteText: { color: '#fff', fontWeight: '700' },
});
