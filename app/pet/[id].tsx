import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { buscarPetPorId } from '../../storage/storage';
import { Pet } from '../../types';
import { Colors } from '../../constants/colors';

export default function PetDetails() {
  const { id } = useLocalSearchParams();
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const p = await buscarPetPorId(String(id));
        setPet(p);
      }
    })();
  }, [id]);

  if (!pet) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: pet.foto }} style={styles.photo} />
      <Text style={styles.name}>{pet.nome}</Text>
      <Text style={styles.info}>{pet.raca} · {pet.peso} kg</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atividades recentes</Text>
        <Text style={{ color: Colors.textSecondary }}>Nenhuma atividade implementada (mock)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  photo: { width: 220, height: 220, borderRadius: 120, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '700' },
  info: { color: Colors.textSecondary, marginBottom: 12 },
  section: { width: '100%', marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
});
