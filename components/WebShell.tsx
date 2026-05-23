import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import { carregarUsuario, carregarPets, carregarAtividades, adicionarPet, setPetPrincipal, atualizarPet, excluirPet, adicionarAtividade, alternarAtividade, limparAtividades, getFotoPorEspecie } from '../storage/storage';
import { Alert } from 'react-native';
import PetCard from './PetCard';
import AtividadeItem from './AtividadeItem';
import PetPreviewCard from './PetPreviewCard';
import { TextInput } from 'react-native';

export default function WebShell() {
  const [usuario, setUsuario] = useState<any | null>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [activityForm, setActivityForm] = useState({ petId: '', titulo: '', tipo: 'alimentacao' as any, horario: '', data: new Date().toISOString().split('T')[0] });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', raca: '', especie: 'cachorro', idade: '', peso: '', observacoes: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmName, setConfirmName] = useState('');

  useEffect(() => {
    (async () => {
      const u = await carregarUsuario();
      setUsuario(u);
      const p = await carregarPets();
      setPets(p);
      const a = await carregarAtividades();
      setAtividades(a.filter((it: any) => it.data === new Date().toISOString().split('T')[0]));
    })();
  }, []);

  const [selectedPet, setSelectedPet] = useState<any | null>(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@clyvo:loggedIn');
      // clear the expo-router failure flag so future reloads try the router again
      try { window.localStorage.removeItem('@clyvo:expoRouterFailed'); } catch {}
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenPet = (pet: any) => {
    setSelectedPet(pet);
  };

  const handleAddActivity = async () => {
    if (!activityForm.petId) return Alert.alert('Erro', 'Selecione um pet');
    if (!activityForm.titulo.trim()) return Alert.alert('Erro', 'Título obrigatório');
    await adicionarAtividade({
      id: Date.now().toString(),
      petId: activityForm.petId,
      titulo: activityForm.titulo,
      tipo: activityForm.tipo,
      horario: activityForm.horario || '—',
      concluida: false,
      data: activityForm.data,
    } as any);
    const a = await carregarAtividades();
    setAtividades(a.filter((it: any) => it.data === activityForm.data));
    setActivityForm({ petId: '', titulo: '', tipo: 'alimentacao', horario: '', data: activityForm.data });
  };

  const handleToggleActivity = async (id: string) => {
    await alternarAtividade(id);
    const a = await carregarAtividades();
    setAtividades(a.filter((it: any) => it.data === new Date().toISOString().split('T')[0]));
  };

  const handleClearAllActivities = async () => {
    // prefer native confirm on web for simplicity
    if (typeof window !== 'undefined' && typeof (window as any).confirm === 'function') {
      const ok = (window as any).confirm('Apagar todas as atividades?');
      if (!ok) return;
      await limparAtividades();
      const a = await carregarAtividades();
      setAtividades(a.filter((it: any) => it.data === new Date().toISOString().split('T')[0]));
      return;
    }

    Alert.alert('Confirmar', 'Apagar todas as atividades?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: async () => { await limparAtividades(); const a = await carregarAtividades(); setAtividades(a.filter((it: any) => it.data === new Date().toISOString().split('T')[0])); } },
    ]);
  };

  const handleAddPet = async () => {
    if (!form.nome.trim()) return alert('Nome é obrigatório');
    if (editingId) {
      await atualizarPet({
        id: editingId,
        nome: form.nome,
        raca: form.raca,
        especie: form.especie,
        idade: Number(form.idade) || 0,
        peso: Number(form.peso) || 0,
        foto: getFotoPorEspecie(form.especie as any),
        observacoes: form.observacoes,
      } as any);
    } else {
      await adicionarPet({
        id: Date.now().toString(),
        nome: form.nome,
        raca: form.raca,
        especie: form.especie,
        idade: Number(form.idade) || 0,
        peso: Number(form.peso) || 0,
        foto: getFotoPorEspecie(form.especie as any),
        observacoes: form.observacoes,
      } as any);
    }
    const p = await carregarPets();
    setPets(p);
    const u = await carregarUsuario();
    setUsuario(u);
    setShowForm(false);
    setEditingId(null);
    setForm({ nome: '', raca: '', especie: 'cachorro', idade: '', peso: '', observacoes: '' });
  };

  const petPrincipalCachorro = pets.find((p: any) => usuario && p.id === usuario.petPrincipalCachorroId && p.especie === 'cachorro') || pets.find((p: any) => p.especie === 'cachorro') || null;
  const petPrincipalGato = pets.find((p: any) => usuario && p.id === usuario.petPrincipalGatoId && p.especie === 'gato') || pets.find((p: any) => p.especie === 'gato') || null;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Olá, {usuario?.nome || 'Tutor'}! 👋</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {petPrincipalCachorro ? (
          <View>
            <Text style={styles.sectionTitle}>Pet principal — Cachorro</Text>
            <PetCard pet={petPrincipalCachorro} onPress={() => handleOpenPet(petPrincipalCachorro)} />
            {selectedPet && selectedPet.id === petPrincipalCachorro.id ? (
              <PetPreviewCard data={{ nome: selectedPet.nome, raca: selectedPet.raca, especie: selectedPet.especie, idade: String(selectedPet.idade), peso: String(selectedPet.peso), observacoes: selectedPet.observacoes }} />
            ) : null}
          </View>
        ) : null}

        {petPrincipalGato ? (
          <View>
            <Text style={styles.sectionTitle}>Pet principal — Gato</Text>
            <PetCard pet={petPrincipalGato} onPress={() => handleOpenPet(petPrincipalGato)} />
            {selectedPet && selectedPet.id === petPrincipalGato.id ? (
              <PetPreviewCard data={{ nome: selectedPet.nome, raca: selectedPet.raca, especie: selectedPet.especie, idade: String(selectedPet.idade), peso: String(selectedPet.peso), observacoes: selectedPet.observacoes }} />
            ) : null}
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Meus Pets</Text>
        <TouchableOpacity style={[styles.saveBtn, { alignSelf: 'flex-start', marginBottom: 8 }]} onPress={() => { setEditingId(null); setShowForm(s => !s); setForm({ nome: '', raca: '', especie: 'cachorro', idade: '', peso: '', observacoes: '' }); }}>
          <Text style={styles.saveText}>{showForm ? 'Cancelar' : 'Adicionar Pet'}</Text>
        </TouchableOpacity>

        {showForm && !editingId ? (
          <View style={{ marginBottom: 12 }}>
            <TextInput placeholder="Nome" value={form.nome} onChangeText={t => setForm(f => ({ ...f, nome: t }))} style={styles.input} />
            <TextInput placeholder="Raça" value={form.raca} onChangeText={t => setForm(f => ({ ...f, raca: t }))} style={styles.input} />
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
              <TouchableOpacity style={[styles.specButton, form.especie === 'cachorro' && styles.specActive]} onPress={() => setForm(f => ({ ...f, especie: 'cachorro' }))}>
                <Text style={styles.specText}>Cachorro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.specButton, form.especie === 'gato' && styles.specActive]} onPress={() => setForm(f => ({ ...f, especie: 'gato' }))}>
                <Text style={styles.specText}>Gato</Text>
              </TouchableOpacity>
            </View>
            <TextInput placeholder="Idade (anos)" value={form.idade} onChangeText={t => setForm(f => ({ ...f, idade: t }))} style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="Peso" value={form.peso} onChangeText={t => setForm(f => ({ ...f, peso: t }))} style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="Observações" value={form.observacoes} onChangeText={t => setForm(f => ({ ...f, observacoes: t }))} style={[styles.input, { height: 80 }]} multiline />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddPet}><Text style={styles.saveText}>Salvar Pet</Text></TouchableOpacity>
            </View>
          </View>
        ) : null}

        {pets.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum pet cadastrado</Text>
        ) : (
          pets.map((p: any) => (
            <View key={p.id}>
              <PetCard pet={p} onPress={() => handleOpenPet(p)} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8, gap: 8 }}>
                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: Colors.background, paddingVertical: 6 }]}
                  onPress={async () => {
                    await setPetPrincipal(p.especie, p.id);
                    const u = await carregarUsuario();
                    setUsuario(u);
                    Alert.alert('Pronto', `Definido como principal (${p.especie})`);
                  }}
                >
                  <Text style={{ color: Colors.primary, fontWeight: '700' }}>Definir como principal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: Colors.background, paddingVertical: 6 }]}
                  onPress={() => {
                    // preencher formulário para edição inline
                    setEditingId(p.id);
                    setShowForm(false);
                    setForm({ nome: p.nome, raca: p.raca, especie: p.especie, idade: String(p.idade || ''), peso: String(p.peso || ''), observacoes: p.observacoes || '' });
                  }}
                >
                  <Text style={{ color: Colors.primary, fontWeight: '700' }}>Editar</Text>
                </TouchableOpacity>
              </View>

              {editingId === p.id ? (
                <View style={{ marginBottom: 12 }}>
                  <TextInput placeholder="Nome" value={form.nome} onChangeText={t => setForm(f => ({ ...f, nome: t }))} style={styles.input} />
                  <TextInput placeholder="Raça" value={form.raca} onChangeText={t => setForm(f => ({ ...f, raca: t }))} style={styles.input} />
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                    <TouchableOpacity style={[styles.specButton, form.especie === 'cachorro' && styles.specActive]} onPress={() => setForm(f => ({ ...f, especie: 'cachorro' }))}>
                      <Text style={styles.specText}>Cachorro</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.specButton, form.especie === 'gato' && styles.specActive]} onPress={() => setForm(f => ({ ...f, especie: 'gato' }))}>
                      <Text style={styles.specText}>Gato</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput placeholder="Idade (anos)" value={form.idade} onChangeText={t => setForm(f => ({ ...f, idade: t }))} style={styles.input} keyboardType="numeric" />
                  <TextInput placeholder="Peso" value={form.peso} onChangeText={t => setForm(f => ({ ...f, peso: t }))} style={styles.input} keyboardType="numeric" />
                  <TextInput placeholder="Observações" value={form.observacoes} onChangeText={t => setForm(f => ({ ...f, observacoes: t }))} style={[styles.input, { height: 80 }]} multiline />
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleAddPet}><Text style={styles.saveText}>Salvar</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.saveBtn, { backgroundColor: Colors.background }]} onPress={() => { setEditingId(null); setForm({ nome: '', raca: '', especie: 'cachorro', idade: '', peso: '', observacoes: '' }); }}><Text style={{ color: Colors.primary, fontWeight: '700' }}>Cancelar</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.saveBtn, { backgroundColor: Colors.error }]} onPress={() => setShowDeleteConfirm(s => !s)}><Text style={styles.saveText}>Excluir</Text></TouchableOpacity>
                  </View>
                  {showDeleteConfirm ? (
                    <View style={{ marginTop: 8 }}>
                      <TextInput placeholder="Digite o nome do pet para confirmar" value={confirmName} onChangeText={setConfirmName} style={styles.input} />
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                        <TouchableOpacity
                          style={[styles.saveBtn, { backgroundColor: Colors.error }]}
                          onPress={async () => {
                            if (!editingId) return;
                            if (confirmName !== form.nome) return Alert.alert('Erro', 'O nome digitado não corresponde');
                            await excluirPet(editingId);
                            const p = await carregarPets();
                            setPets(p);
                            setEditingId(null);
                            setShowForm(false);
                            setConfirmName('');
                          }}
                          disabled={confirmName !== form.nome}
                        >
                          <Text style={styles.saveText}>Confirmar exclusão</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.clearBtn} onPress={() => { setShowDeleteConfirm(false); setConfirmName(''); }}>
                          <Text style={styles.clearText}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Adicionar atividade</Text>
        <View style={{ marginBottom: 8 }}>
          <Text style={{ marginBottom: 6 }}>Escolha o pet:</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {pets.map(p => (
              <TouchableOpacity key={p.id} onPress={() => setActivityForm(f => ({ ...f, petId: p.id }))} style={[styles.specButton, activityForm.petId === p.id && styles.specActive]}>
                <Text style={styles.specText}>{p.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput placeholder="Título" value={activityForm.titulo} onChangeText={t => setActivityForm(f => ({ ...f, titulo: t }))} style={styles.input} />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TouchableOpacity style={[styles.specButton, activityForm.tipo === 'alimentacao' && styles.specActive]} onPress={() => setActivityForm(f => ({ ...f, tipo: 'alimentacao' }))}><Text style={styles.specText}>Alimentação</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.specButton, activityForm.tipo === 'exercicio' && styles.specActive]} onPress={() => setActivityForm(f => ({ ...f, tipo: 'exercicio' }))}><Text style={styles.specText}>Exercício</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.specButton, activityForm.tipo === 'saude' && styles.specActive]} onPress={() => setActivityForm(f => ({ ...f, tipo: 'saude' }))}><Text style={styles.specText}>Saúde</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.specButton, activityForm.tipo === 'higiene' && styles.specActive]} onPress={() => setActivityForm(f => ({ ...f, tipo: 'higiene' }))}><Text style={styles.specText}>Higiene</Text></TouchableOpacity>
          </View>
          <TextInput placeholder="Horário (ex: 09:00)" value={activityForm.horario} onChangeText={t => setActivityForm(f => ({ ...f, horario: t }))} style={styles.input} />
          <TouchableOpacity style={styles.saveBtn} onPress={handleAddActivity}><Text style={styles.saveText}>Salvar atividade</Text></TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>Próximas atividades</Text>
          <TouchableOpacity onPress={handleClearAllActivities}>
            <Text style={{ color: Colors.error, fontWeight: '700' }}>Apagar tudo</Text>
          </TouchableOpacity>
        </View>
        {atividades.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma atividade para hoje</Text>
        ) : (
          atividades.map((a: any) => {
            const pet = pets.find(p => p.id === a.petId);
            return <AtividadeItem key={a.id} atividade={a} onToggle={handleToggleActivity} petName={pet ? pet.nome : ''} />;
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 120 },
  greeting: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  logoutBtn: { backgroundColor: Colors.primary, padding: 8, borderRadius: 8, alignSelf: 'flex-end' },
  logoutText: { color: '#fff', fontWeight: '700' },
  emptyText: { color: Colors.textSecondary, fontStyle: 'italic' },
  input: { backgroundColor: Colors.surface, padding: 10, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  saveBtn: { backgroundColor: Colors.primary, padding: 10, borderRadius: 10 },
  saveText: { color: '#fff', fontWeight: '700' },
  clearBtn: { backgroundColor: Colors.background, padding: 10, borderRadius: 10 },
  clearText: { fontWeight: '700', color: Colors.primary },
  specButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: Colors.background },
  specActive: { backgroundColor: Colors.primaryLight },
  specText: { fontWeight: '700' },
});
