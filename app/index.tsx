import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MetricCard from '../components/MetricCard';
import PetPreviewCard from '../components/PetPreviewCard';
import PetsManager from '../components/PetsManager';
import { Colors } from '../constants/colors';
import { FormDataPet } from '../types';
import { carregarPets, inicializarDados } from '../storage/storage';
import { Pet } from '../types';
import PetCard from '../components/PetCard';
// removed programmatic redirect to avoid routing conflicts; auth handled by layout

export default function Index() {
  const router = useRouter();
  const [manage, setManage] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const pet: FormDataPet = {
    nome: 'Rex',
    raca: 'Labrador',
    especie: 'cachorro',
    idade: '4',
    peso: '12',
    observacoes: 'Brincalhão e carinhoso',
  };

  useEffect(() => {
    (async () => {
      // A navegação de autenticação é tratada no _layout.tsx
      await inicializarDados();
      const p = await carregarPets();
      setPets(p);
      if (p.length > 0) setSelectedPet(p[0]);
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.title}>Pets</Text>
          <TouchableOpacity onPress={() => setManage(m => !m)} style={styles.manageBtn}>
            <Text style={styles.manageText}>{manage ? 'Fechar' : 'Gerenciar Pets'}</Text>
          </TouchableOpacity>
        </View>

        {manage ? (
          <PetsManager />
        ) : (
          <>
            <View>
              {pets.map(p => (
                <TouchableOpacity key={p.id} onPress={() => setSelectedPet(p)} activeOpacity={0.9}>
                  <PetCard pet={p} onPress={() => setSelectedPet(p)} />
                </TouchableOpacity>
              ))}
            </View>

            {selectedPet ? (
              <PetPreviewCard
                data={{
                  nome: selectedPet.nome,
                  raca: selectedPet.raca,
                  especie: selectedPet.especie,
                  idade: String(selectedPet.idade),
                  peso: String(selectedPet.peso),
                  observacoes: selectedPet.observacoes || '',
                }}
              />
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 14 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  manageBtn: {
    backgroundColor: Colors?.primary || '#6C63FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  manageText: { color: '#fff', fontWeight: '700' },
});
