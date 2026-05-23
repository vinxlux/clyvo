import React, { useEffect, useState } from 'react';
// AsyncStorage not needed here – storage utilities handle persistence
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/colors';
import { carregarUsuario, carregarPets, carregarAtividades, alternarAtividade, limparAtividades } from '../../storage/storage';
import { Usuario, Pet, Atividade } from '../../types';
import PetCard from '../../components/PetCard';
import PetPreviewCard from '../../components/PetPreviewCard';
import AtividadeItem from '../../components/AtividadeItem';
import MetricCard from '../../components/MetricCard';

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);

  useEffect(() => {
    (async () => {
      const u = await carregarUsuario();
      setUsuario(u);
      const p = await carregarPets();
      setPets(p);
      const a = await carregarAtividades();
      setAtividades(a.filter(it => it.data === new Date().toISOString().split('T')[0]));
    })();
  }, []);

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem('@clyvo:loggedIn');
      setUsuario(null);
      // redirect to login so the layout can render the unauthenticated stack
      router.replace('/login');
    } catch (e) {
      console.error('Erro ao fazer logout', e);
    }
  }

  async function handleToggle(id: string) {
    const novos = await alternarAtividade(id);
    setAtividades(novos.filter(it => it.data === new Date().toISOString().split('T')[0]));
  }

  const petPrincipalCachorro = pets.find(p => usuario && p.id === usuario.petPrincipalCachorroId && p.especie === 'cachorro') || pets.find(p => p.especie === 'cachorro') || null;
  const petPrincipalGato = pets.find(p => usuario && p.id === usuario.petPrincipalGatoId && p.especie === 'gato') || pets.find(p => p.especie === 'gato') || null;

  const handleClearAllActivities = async () => {
    if (typeof window !== 'undefined' && typeof (window as any).confirm === 'function') {
      const ok = (window as any).confirm('Apagar todas as atividades?');
      if (!ok) return;
      await limparAtividades();
      const a = await carregarAtividades();
      setAtividades(a.filter(it => it.data === new Date().toISOString().split('T')[0]));
      return;
    }

    Alert.alert('Confirmar', 'Apagar todas as atividades?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: async () => { await limparAtividades(); const a = await carregarAtividades(); setAtividades(a.filter(it => it.data === new Date().toISOString().split('T')[0])); } },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Olá, {usuario?.nome || 'Tutor'}! 👋</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {petPrincipalCachorro ? (
          <View>
            <Text style={styles.sectionTitle}>Pet principal — Cachorro</Text>
            <PetCard pet={petPrincipalCachorro} onPress={() => router.push(`/pet/${petPrincipalCachorro.id}`)} />
            <PetPreviewCard data={{ nome: petPrincipalCachorro.nome, raca: petPrincipalCachorro.raca, especie: petPrincipalCachorro.especie, idade: String(petPrincipalCachorro.idade), peso: String(petPrincipalCachorro.peso), observacoes: petPrincipalCachorro.observacoes }} />
          </View>
        ) : null}

        {petPrincipalGato ? (
          <View>
            <Text style={styles.sectionTitle}>Pet principal — Gato</Text>
            <PetCard pet={petPrincipalGato} onPress={() => router.push(`/pet/${petPrincipalGato.id}`)} />
            <PetPreviewCard data={{ nome: petPrincipalGato.nome, raca: petPrincipalGato.raca, especie: petPrincipalGato.especie, idade: String(petPrincipalGato.idade), peso: String(petPrincipalGato.peso), observacoes: petPrincipalGato.observacoes }} />
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Hoje</Text>
        <View style={styles.row}>
          <MetricCard titulo="Caminhada" valor="—" icone="walk" cor={Colors.primary} />
          <MetricCard titulo="Alimentação" valor="—" icone="restaurant" cor={Colors.secondary} />
          <MetricCard titulo="Hidratação" valor="—" icone="water" cor={Colors.accent} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Próximas atividades</Text>
          <TouchableOpacity onPress={handleClearAllActivities}>
            <Text style={{ color: Colors.error, fontWeight: '700' }}>Apagar tudo</Text>
          </TouchableOpacity>
        </View>
        {atividades.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma atividade para hoje</Text>
        ) : (
          atividades.map(a => {
            const pet = pets.find(p => p.id === a.petId);
            return <AtividadeItem key={a.id} atividade={a} onToggle={handleToggle} petName={pet ? pet.nome : ''} />;
          })
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => { router.push('/cadastro'); }}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 120 },
  greeting: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 10 },
  emptyText: { color: Colors.textSecondary, fontStyle: 'italic' },
  logoutBtn: { position: 'absolute', right: 16, top: 12, backgroundColor: Colors.primary, padding: 8, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: '700' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 28 },
});
