import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { carregarPets } from '../../storage/storage';
import { Pet } from '../../types';
import PetCard from '../../components/PetCard';
import { Colors } from '../../constants/colors';

export default function PetsScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const p = await carregarPets();
      setPets(p);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Meus Pets</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/cadastro')}>
          <Text style={styles.addText}>+ Adicionar pet</Text>
        </TouchableOpacity>
      </View>

      {pets.map(p => (
        <TouchableOpacity key={p.id} onPress={() => router.push(`/pet/${p.id}`)}>
          <PetCard pet={p} onPress={() => router.push(`/pet/${p.id}`)} />
        </TouchableOpacity>
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
});
