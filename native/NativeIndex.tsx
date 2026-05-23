import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { salvarUsuario, buscarUsuario, carregarUsuario, carregarPets, carregarAtividades, alternarAtividade, adicionarPet, atualizarAtividade, excluirAtividade, setPetPrincipal, adicionarAtividade } from '../storage/storage';
import { Pet, Usuario, Atividade } from '../types';
import PetCard from '../components/PetCard';
import AtividadeItem from '../components/AtividadeItem';
import { Colors } from '../constants/colors';
import NativeCadastro from './NativeCadastro';
import NativeAtividadeEditor from './NativeAtividadeEditor';

export default function NativeIndex() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const flag = await AsyncStorage.getItem('@clyvo:loggedIn');
        setLoggedIn(flag === 'true');
      } catch (e) {
        setLoggedIn(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    (async () => {
      try {
        const u = await carregarUsuario();
        setUsuario(u);
        const p = await carregarPets();
        setPets(p);
        const a = await carregarAtividades();
        const today = new Date().toISOString().split('T')[0];
        setAtividades(a.filter(it => it.data >= today).sort((a, b) => a.data.localeCompare(b.data)));
      } catch (e) {
        console.error('NativeIndex: erro ao carregar dados', e);
      }
    })();
  }, [loggedIn]);

  async function doLogin() {
    if (!email || !senha) return Alert.alert('Erro', 'Preencha email e senha');
    try {
      const user = await buscarUsuario(email);
      if (!user || user.senha !== senha) return Alert.alert('Erro', 'Credenciais inválidas');
      await AsyncStorage.setItem('@clyvo:loggedIn', 'true');
      await AsyncStorage.setItem('@clyvo:userEmail', email);
      setLoggedIn(true);
    } catch (e) {
      Alert.alert('Erro', 'Falha ao efetuar login');
    }
  }

  async function doRegister(nome?: string) {
    if (!email || !senha) return Alert.alert('Erro', 'Preencha email e senha');
    try {
      const existente = await buscarUsuario(email);
      if (existente) return Alert.alert('Erro', 'Já existe usuário com esse email');
      await salvarUsuario({ nome: nome || email.split('@')[0], email, senha });
      await AsyncStorage.setItem('@clyvo:loggedIn', 'true');
      await AsyncStorage.setItem('@clyvo:userEmail', email);
      setLoggedIn(true);
    } catch (e) {
      Alert.alert('Erro', 'Falha ao registrar');
    }
  }

  async function doLogout() {
    await AsyncStorage.removeItem('@clyvo:loggedIn');
    setLoggedIn(false);
    setScreen('login');
    setUsuario(null);
    setPets([]);
    setAtividades([]);
  }

  async function handleToggle(id: string) {
    const novos = await alternarAtividade(id);
    const today = new Date().toISOString().split('T')[0];
    setAtividades(novos.filter(it => it.data >= today).sort((a, b) => a.data.localeCompare(b.data)));
  }

  async function refreshActivities() {
    const a = await carregarAtividades();
    const today = new Date().toISOString().split('T')[0];
    setAtividades(a.filter(it => it.data >= today).sort((a, b) => a.data.localeCompare(b.data)));
  }

  // Minimal add pet for native fallback (keeps behavior similar to web)
  // Local screen navigation: 'login' | 'register' | 'home' | 'cadastro' | 'atividadeEditor'
  const [screen, setScreen] = useState<'login' | 'register' | 'home' | 'cadastro' | 'atividadeEditor'>('login');
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [editingActivity, setEditingActivity] = useState<Atividade | null>(null);
  const [activityForm, setActivityForm] = useState({
    petId: '',
    titulo: '',
    tipo: 'exercicio' as Atividade['tipo'],
    horario: '',
    data: new Date().toISOString().split('T')[0],
  });

  async function handleAddActivity() {
    if (!activityForm.petId) {
      Alert.alert('Erro', 'Selecione um pet');
      return;
    }

    if (!activityForm.titulo.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return;
    }

    if (!activityForm.horario.trim()) {
      Alert.alert('Erro', 'Horário é obrigatório');
      return;
    }

    const parsedDate = new Date(activityForm.data);
    if (Number.isNaN(parsedDate.getTime())) {
      Alert.alert('Erro', 'Data inválida. Use o formato YYYY-MM-DD');
      return;
    }

    await adicionarAtividade({
      id: Date.now().toString(),
      petId: activityForm.petId,
      titulo: activityForm.titulo.trim(),
      tipo: activityForm.tipo,
      horario: activityForm.horario.trim(),
      concluida: false,
      data: activityForm.data,
    });

    setActivityForm({
      petId: '',
      titulo: '',
      tipo: 'exercicio',
      horario: '',
      data: new Date().toISOString().split('T')[0],
    });
    await refreshActivities();
  }

  async function handleAddPetQuick() {
    const novo: Pet = {
      id: Date.now().toString(),
      nome: 'Novo Pet',
      raca: 'Desconhecida',
      especie: 'cachorro',
      idade: 1,
      peso: 1,
      foto: 'https://placedog.net/300/300',
      observacoes: '',
    };
    await adicionarPet(novo);
    const p = await carregarPets();
    setPets(p);
  }

  if (loggedIn === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!loggedIn) {
    // Show separate login / register screens
    if (screen === 'register') {
      const NativeRegister = require('./NativeRegister').default;
      return <NativeRegister onRegistered={async () => { const u = await carregarUsuario(); setUsuario(u); setLoggedIn(true); setScreen('home'); }} onCancel={() => setScreen('login')} />;
    }

    return (
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: 12 }}>Entrar</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
        <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />
        <TouchableOpacity style={[styles.btn, { marginTop: 8 }]} onPress={doLogin}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { marginTop: 8, backgroundColor: Colors.background }]} onPress={() => setScreen('register')}>
          <Text style={{ color: Colors.primary, fontWeight: '700' }}>Registrar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const petPrincipalCachorro = pets.find(p => usuario && p.id === usuario.petPrincipalCachorroId && p.especie === 'cachorro') || pets.find(p => p.especie === 'cachorro') || null;
  const petPrincipalGato = pets.find(p => usuario && p.id === usuario.petPrincipalGatoId && p.especie === 'gato') || pets.find(p => p.especie === 'gato') || null;

  async function handleEditPet(pet: Pet) {
    setEditingPet(pet);
    setScreen('cadastro');
  }

  async function handleEditActivity(id: string) {
    const atividade = atividades.find(item => item.id === id);
    if (!atividade) {
      Alert.alert('Erro', 'Atividade não encontrada');
      return;
    }

    setEditingActivity(atividade);
    setScreen('atividadeEditor');
  }

  if (screen === 'cadastro') {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NativeCadastro
          pet={editingPet || undefined}
          onDone={async () => {
            const p = await carregarPets();
            setPets(p);
            setEditingPet(null);
            setScreen('home');
          }}
          onCancel={() => {
            setEditingPet(null);
            setScreen('home');
          }}
        />
      </SafeAreaView>
    );
  }

  if (screen === 'atividadeEditor' && editingActivity) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NativeAtividadeEditor
          atividade={editingActivity}
          pets={pets}
          onDone={async (updated) => {
            await atualizarAtividade(updated);
            await refreshActivities();
            setEditingActivity(null);
            setScreen('home');
          }}
          onCancel={() => {
            setEditingActivity(null);
            setScreen('home');
          }}
          onDelete={async (id) => {
            await excluirAtividade(id);
            await refreshActivities();
            setEditingActivity(null);
            setScreen('home');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Olá, {usuario?.nome || 'Tutor'}! 👋</Text>
        <TouchableOpacity onPress={doLogout} style={{ backgroundColor: Colors.primary, padding: 8, borderRadius: 8, alignSelf: 'flex-end', marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Logout</Text>
        </TouchableOpacity>

        {petPrincipalCachorro ? (
          <View>
            <Text style={styles.sectionTitle}>Pet principal — Cachorro</Text>
            <PetCard pet={petPrincipalCachorro} onPress={() => {}} />
          </View>
        ) : null}

        {petPrincipalGato ? (
          <View>
            <Text style={styles.sectionTitle}>Pet principal — Gato</Text>
            <PetCard pet={petPrincipalGato} onPress={() => {}} />
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Próximas atividades</Text>
        <View style={{ marginBottom: 12, padding: 12, borderRadius: 16, backgroundColor: Colors.surface }}>
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Adicionar nova atividade</Text>
          <Text style={{ marginBottom: 6 }}>Selecione o pet:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {pets.map(p => (
              <TouchableOpacity
                key={p.id}
                onPress={() => setActivityForm(prev => ({ ...prev, petId: p.id }))}
                style={[styles.activityChip, activityForm.petId === p.id && styles.activityChipActive]}
              >
                <Text style={[styles.activityChipText, activityForm.petId === p.id && styles.activityChipTextActive]}>{p.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Título"
            value={activityForm.titulo}
            onChangeText={t => setActivityForm(prev => ({ ...prev, titulo: t }))}
            style={styles.activityInput}
          />
          <TextInput
            placeholder="Horário (ex: 08:00)"
            value={activityForm.horario}
            onChangeText={t => setActivityForm(prev => ({ ...prev, horario: t }))}
            style={styles.activityInput}
          />
          <TextInput
            placeholder="Data (YYYY-MM-DD)"
            value={activityForm.data}
            onChangeText={t => setActivityForm(prev => ({ ...prev, data: t }))}
            style={styles.activityInput}
            autoCapitalize="none"
          />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {(['exercicio', 'alimentacao', 'saude', 'higiene'] as Atividade['tipo'][]).map(tipo => (
              <TouchableOpacity
                key={tipo}
                onPress={() => setActivityForm(prev => ({ ...prev, tipo }))}
                style={[styles.activityChip, activityForm.tipo === tipo && styles.activityChipActive]}
              >
                <Text style={[styles.activityChipText, activityForm.tipo === tipo && styles.activityChipTextActive]}>{tipo}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={{ backgroundColor: Colors.accent, padding: 12, borderRadius: 10, alignItems: 'center' }} onPress={handleAddActivity}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Adicionar atividade</Text>
          </TouchableOpacity>
        </View>

        {atividades.length === 0 ? (
          <Text style={{ color: Colors.textSecondary, fontStyle: 'italic' }}>Nenhuma atividade para as próximas datas</Text>
        ) : (
          atividades.map(a => {
            const pet = pets.find(p => p.id === a.petId);
            return <AtividadeItem key={a.id} atividade={a} onToggle={handleToggle} onEdit={handleEditActivity} petName={pet ? pet.nome : ''} />;
          })
        )}

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Todos os pets</Text>
        {pets.map(p => (
          <View key={p.id} style={{ marginBottom: 12 }}>
            <PetCard pet={p} onPress={() => {}} />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity style={{ backgroundColor: Colors.background, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, flex: 1, alignItems: 'center' }} onPress={() => handleEditPet(p)}>
                <Text style={{ color: Colors.primary, fontWeight: '700' }}>Editar Pet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: Colors.primaryLight, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, flex: 1, alignItems: 'center' }}
                onPress={async () => {
                  await setPetPrincipal(p.especie, p.id);
                  const u = await carregarUsuario();
                  setUsuario(u);
                  Alert.alert('Pronto', `Definido como principal (${p.especie})`);
                }}
              >
                <Text style={{ color: Colors.primary, fontWeight: '700' }}>Definir principal</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <TouchableOpacity style={{ backgroundColor: Colors.accent, padding: 12, borderRadius: 10, flex: 1, alignItems: 'center' }} onPress={() => { setEditingPet(null); setScreen('cadastro'); }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Cadastrar Pet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: Colors.primary, padding: 12, borderRadius: 10, flex: 1, alignItems: 'center' }} onPress={handleAddPetQuick}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Adicionar rápido</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: { width: '100%', backgroundColor: Colors.surface, padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  btn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, width: '100%', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  activityInput: { backgroundColor: Colors.background, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  activityChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: Colors.background },
  activityChipActive: { backgroundColor: Colors.primaryLight },
  activityChipText: { fontWeight: '700' },
  activityChipTextActive: { color: Colors.primary },
});
