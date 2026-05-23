import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { carregarPets } from '../../storage/storage';
import { Pet } from '../../types';
import PetCard from '../../components/PetCard';
import { Colors } from '../../constants/colors';
import { setPetPrincipal } from '../../storage/storage';

export default function PetsScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filter, setFilter] = useState<'todos' | 'cachorro' | 'gato'>('todos');
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const p = await carregarPets();
      if (mounted) setPets(p);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Meus Pets</Text>
        <Pressable style={styles.addBtn} onPress={() => router.push('/cadastro')}>
          <Text style={styles.addText}>+ Adicionar pet</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <Pressable onPress={() => setFilter('todos')} style={[styles.filterBtn, filter === 'todos' && styles.filterActive]}>
          <Text style={styles.filterText}>Todos</Text>
        </Pressable>
        <Pressable onPress={() => setFilter('cachorro')} style={[styles.filterBtn, filter === 'cachorro' && styles.filterActive]}>
          <Text style={styles.filterText}>Cachorros</Text>
        </Pressable>
        <Pressable onPress={() => setFilter('gato')} style={[styles.filterBtn, filter === 'gato' && styles.filterActive]}>
          <Text style={styles.filterText}>Gatos</Text>
        </Pressable>
      </View>

      {pets
        .filter(p => filter === 'todos' ? true : p.especie === filter)
        .map(p => (
          <View key={p.id}>
            <Pressable onPress={() => router.push(`/pet/${p.id}`)}>
              <PetCard pet={p} onPress={() => router.push(`/pet/${p.id}`)} />
            </Pressable>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
              <Pressable
                style={styles.principalBtn}
                onPress={async () => {
                  await setPetPrincipal(p.especie, p.id);
                  Alert.alert('Pronto', `Definido como pet principal (${p.especie})`);
                }}
              >
                <Text style={styles.principalText}>Definir como principal</Text>
              </Pressable>
              <Pressable style={[styles.principalBtn, { marginLeft: 8 }]} onPress={() => router.push(`/cadastro?id=${p.id}`)}>
                <Text style={styles.principalText}>Editar</Text>
              </Pressable>
            </View>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  addBtn: { backgroundColor: Colors.primary, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  addText: { color: '#fff', fontWeight: '700' },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: Colors.surface },
  filterActive: { backgroundColor: Colors.primary },
  filterText: { fontWeight: '700' },
  principalBtn: { backgroundColor: Colors.background, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  principalText: { color: Colors.primary, fontWeight: '700' },
});
