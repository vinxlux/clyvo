import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { salvarUsuario, buscarUsuario, carregarUsuario, carregarPets, carregarAtividades, alternarAtividade, adicionarPet } from '../storage/storage';
import { Pet, Usuario, Atividade } from '../types';
import PetCard from '../components/PetCard';
import AtividadeItem from '../components/AtividadeItem';
import { Colors } from '../constants/colors';
import NativeCadastro from './NativeCadastro';

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
        setAtividades(a.filter(it => it.data === new Date().toISOString().split('T')[0]));
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
    setUsuario(null);
    setPets([]);
    setAtividades([]);
  }

  async function handleToggle(id: string) {
    const novos = await alternarAtividade(id);
    setAtividades(novos.filter(it => it.data === new Date().toISOString().split('T')[0]));
  }

  // Minimal add pet for native fallback (keeps behavior similar to web)
  // Local screen navigation: 'home' | 'cadastro'
  const [screen, setScreen] = useState<'home' | 'cadastro'>('home');

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

  if (screen === 'cadastro') {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NativeCadastro onDone={async () => { const p = await carregarPets(); setPets(p); setScreen('home'); }} onCancel={() => setScreen('home')} />
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
        {atividades.length === 0 ? (
          <Text style={{ color: Colors.textSecondary, fontStyle: 'italic' }}>Nenhuma atividade para hoje</Text>
        ) : (
          atividades.map(a => {
            const pet = pets.find(p => p.id === a.petId);
            return <AtividadeItem key={a.id} atividade={a} onToggle={handleToggle} petName={pet ? pet.nome : ''} />;
          })
        )}

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Todos os pets</Text>
        {pets.map(p => (
          <View key={p.id} style={{ marginBottom: 12 }}>
            <PetCard pet={p} onPress={() => {}} />
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <TouchableOpacity style={{ backgroundColor: Colors.accent, padding: 12, borderRadius: 10, flex: 1, alignItems: 'center' }} onPress={() => setScreen('cadastro')}>
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
});
