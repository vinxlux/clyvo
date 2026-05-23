import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';
import { carregarUsuario, carregarPets, carregarAtividades, alternarAtividade } from '../../storage/storage';
import { Usuario, Pet, Atividade } from '../../types';
import PetCard from '../../components/PetCard';
import PetPreviewCard from '../../components/PetPreviewCard';
import AtividadeItem from '../../components/AtividadeItem';
import MetricCard from '../../components/MetricCard';

export default function Home() {
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

  async function handleToggle(id: string) {
    const novos = await alternarAtividade(id);
    setAtividades(novos.filter(it => it.data === new Date().toISOString().split('T')[0]));
  }

  const petPrincipal = pets.find(p => usuario && p.id === usuario.petPrincipalId) || pets[0] || null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Olá, {usuario?.nome || 'Tutor'}! 👋</Text>

        {petPrincipal ? (
          <View>
            <Text style={styles.sectionTitle}>Pet principal</Text>
            <PetCard pet={petPrincipal} onPress={() => {}} />
            <PetPreviewCard data={{ nome: petPrincipal.nome, raca: petPrincipal.raca, especie: petPrincipal.especie, nascimento: petPrincipal.nascimento, peso: String(petPrincipal.peso), observacoes: petPrincipal.observacoes }} />
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Hoje</Text>
        <View style={styles.row}>
          <MetricCard titulo="Caminhada" valor="—" icone="walk" cor={Colors.primary} />
          <MetricCard titulo="Alimentação" valor="—" icone="restaurant" cor={Colors.secondary} />
          <MetricCard titulo="Hidratação" valor="—" icone="water" cor={Colors.accent} />
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Próximas atividades</Text>
        {atividades.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma atividade para hoje</Text>
        ) : (
          atividades.map(a => <AtividadeItem key={a.id} atividade={a} onToggle={handleToggle} />)
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => { /* futura ação para adicionar atividade rápida */ }}>
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
