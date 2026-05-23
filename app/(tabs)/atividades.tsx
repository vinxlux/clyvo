import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Atividade } from '../../types';
import { carregarAtividades, alternarAtividade, adicionarAtividade, carregarPets } from '../../storage/storage';
import { Pet } from '../../types';
import AtividadeItem from '../../components/AtividadeItem';

export default function AtividadesScreen() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [filter, setFilter] = useState<'todas' | Atividade['tipo']>('todas');
  const [form, setForm] = useState({ titulo: '', tipo: 'exercicio' as Atividade['tipo'], horario: '' });
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');

  // Load activities on mount
  useEffect(() => {
    (async () => {
      const data = await carregarAtividades();
      setAtividades(data);
      const p = await carregarPets();
      setPets(p);
    })();
  }, []);

  const filtered = atividades.filter(a => filter === 'todas' || a.tipo === filter);

  const handleToggle = async (id: string) => {
    const updated = await alternarAtividade(id);
    setAtividades(updated);
  };

  const handleAdd = async () => {
    if (!form.titulo || !form.horario) return;
    if (!selectedPetId) return;
    const nova: Atividade = {
      id: Date.now().toString(),
      petId: selectedPetId,
      titulo: form.titulo,
      tipo: form.tipo,
      horario: form.horario,
      concluida: false,
      data: new Date().toISOString().split('T')[0],
    };
    await adicionarAtividade(nova);
    const refreshed = await carregarAtividades();
    setAtividades(refreshed);
    setForm({ titulo: '', tipo: 'exercicio', horario: '' });
  };

  const FilterButton = ({ label, value }: { label: string; value: typeof filter }) => (
    <TouchableOpacity
      style={[styles.filterBtn, filter === value && styles.filterBtnActive]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterBtnText, filter === value && styles.filterBtnTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atividades</Text>

      {/* Filtros */}
      <View style={styles.filterRow}>
        <FilterButton label="Todas" value="todas" />
        <FilterButton label="Exercício" value="exercicio" />
        <FilterButton label="Alimentação" value="alimentacao" />
        <FilterButton label="Saúde" value="saude" />
        <FilterButton label="Higiene" value="higiene" />
      </View>

      {/* Lista de atividades */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const pet = pets.find(p => p.id === item.petId);
          return <AtividadeItem atividade={item} onToggle={handleToggle} petName={pet ? pet.nome : ''} />;
        }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma atividade encontrada.</Text>}
        style={styles.list}
      />

      {/* Formulário inline */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Adicionar nova atividade</Text>
        <Text style={{ marginBottom: 6 }}>Selecione o pet:</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {pets.map(p => (
            <TouchableOpacity key={p.id} onPress={() => setSelectedPetId(p.id)} style={[styles.typeBtn, selectedPetId === p.id && styles.typeBtnActive]}>
              <Text style={[styles.typeBtnText, selectedPetId === p.id && styles.typeBtnTextActive]}>{p.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          placeholder="Título"
          value={form.titulo}
          onChangeText={t => setForm(f => ({ ...f, titulo: t }))}
          style={styles.input}
        />
        <View style={styles.typeRow}>
          {(['exercicio', 'alimentacao', 'saude', 'higiene'] as Atividade['tipo'][]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, form.tipo === t && styles.typeBtnActive]}
              onPress={() => setForm(f => ({ ...f, tipo: t }))}
            >
              <Text style={[styles.typeBtnText, form.tipo === t && styles.typeBtnTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          placeholder="Horário (ex: 08:00)"
          value={form.horario}
          onChangeText={h => setForm(f => ({ ...f, horario: h }))}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Ionicons name="add" size={20} color={Colors.surface} />
          <Text style={styles.addBtnText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: Colors.background },
  filterBtnActive: { backgroundColor: Colors.primary },
  filterBtnText: { fontSize: 13, color: Colors.textSecondary },
  filterBtnTextActive: { color: Colors.surface },
  list: { flexGrow: 0, marginBottom: 16 },
  empty: { textAlign: 'center', color: Colors.textSecondary, fontStyle: 'italic' },
  form: { padding: 12, backgroundColor: Colors.surface, borderRadius: 16, elevation: 2 },
  formTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: Colors.textPrimary },
  input: { backgroundColor: Colors.background, borderRadius: 8, padding: 10, marginBottom: 8 },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  typeBtn: { flex: 1, paddingVertical: 6, marginHorizontal: 4, borderRadius: 8, backgroundColor: Colors.background, alignItems: 'center' },
  typeBtnActive: { backgroundColor: Colors.primary },
  typeBtnText: { fontSize: 12, color: Colors.textSecondary },
  typeBtnTextActive: { color: Colors.surface },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.accent, paddingVertical: 10, borderRadius: 8, marginTop: 8 },
  addBtnText: { color: Colors.surface, marginLeft: 6, fontWeight: '600' },
});
