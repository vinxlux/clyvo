import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { adicionarPet, atualizarPet, excluirPet, getFotoPorEspecie } from '../storage/storage';
import PetPreviewCard from '../components/PetPreviewCard';
import { FormDataPet, Pet } from '../types';

export default function NativeCadastro({ onDone, onCancel, pet }: { onDone: () => void; onCancel: () => void; pet?: Pet }) {
  const [formData, setFormData] = useState<FormDataPet>({
    nome: '',
    raca: '',
    especie: 'cachorro',
    idade: '',
    peso: '',
    observacoes: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmName, setConfirmName] = useState('');

  useEffect(() => {
    if (!pet) {
      setFormData({
        nome: '',
        raca: '',
        especie: 'cachorro',
        idade: '',
        peso: '',
        observacoes: '',
      });
      setShowDeleteConfirm(false);
      setConfirmName('');
      return;
    }

    setFormData({
      nome: pet.nome,
      raca: pet.raca,
      especie: pet.especie,
      idade: String(pet.idade || ''),
      peso: String(pet.peso || ''),
      observacoes: pet.observacoes || '',
    });
    setShowDeleteConfirm(false);
    setConfirmName('');
  }, [pet]);

  function updateField<K extends keyof FormDataPet>(key: K, value: FormDataPet[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    updateField('nome', '');
    updateField('raca', '');
    updateField('especie', 'cachorro');
    updateField('idade', '');
    updateField('peso', '');
    updateField('observacoes', '');
    setShowDeleteConfirm(false);
    setConfirmName('');
  }

  async function handleSave() {
    const nome = formData.nome.trim();

    if (!nome) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    if (formData.idade !== '' && Number.isNaN(Number(formData.idade))) {
      Alert.alert('Erro', 'Idade deve ser um número válido');
      return;
    }

    if (formData.peso !== '' && Number.isNaN(Number(formData.peso))) {
      Alert.alert('Erro', 'Peso deve ser um número válido');
      return;
    }

    const idade = Number(formData.idade || 0);
    const peso = Number(formData.peso || 0);

    if (idade < 0) {
      Alert.alert('Erro', 'Idade não pode ser negativa');
      return;
    }

    if (peso < 0) {
      Alert.alert('Erro', 'Peso não pode ser negativo');
      return;
    }

    const novo: Pet = {
      id: pet?.id || Date.now().toString(),
      nome,
      raca: formData.raca || 'Desconhecida',
      especie: formData.especie,
      idade,
      peso,
      foto: getFotoPorEspecie(formData.especie),
      observacoes: formData.observacoes || '',
    };

    try {
      if (pet?.id) {
        await atualizarPet(novo);
      } else {
        await adicionarPet(novo);
      }
      onDone();
    } catch (error) {
      console.error('NativeCadastro: erro ao salvar', error);
      Alert.alert('Erro', 'Falha ao salvar pet');
    }
  }

  async function handleDelete() {
    if (!pet?.id) return;

    if (confirmName !== formData.nome) {
      Alert.alert('Erro', 'O nome digitado não corresponde ao pet');
      return;
    }

    try {
      await excluirPet(String(pet.id));
      onDone();
    } catch (error) {
      console.error('NativeCadastro: erro ao excluir', error);
      Alert.alert('Erro', 'Falha ao excluir pet');
    }
  }

  return (
    <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{pet?.id ? 'Editar Pet' : 'Cadastrar Pet'}</Text>

          <View style={styles.headerSpacer} />
        </View>

        <TextInput placeholder="Nome" value={formData.nome} onChangeText={t => updateField('nome', t)} style={styles.input} />
        <TextInput placeholder="Raça" value={formData.raca} onChangeText={t => updateField('raca', t)} style={styles.input} />

        <View style={styles.specRow}>
          <TouchableOpacity onPress={() => updateField('especie', 'cachorro')} style={[styles.specBtn, formData.especie === 'cachorro' && styles.specActive]}>
            <Text style={styles.specLabel}>Cachorro</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateField('especie', 'gato')} style={[styles.specBtn, formData.especie === 'gato' && styles.specActive]}>
            <Text style={styles.specLabel}>Gato</Text>
          </TouchableOpacity>
        </View>

        <TextInput placeholder="Idade (anos)" value={formData.idade} onChangeText={t => updateField('idade', t)} style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Peso (kg)" value={formData.peso} onChangeText={t => updateField('peso', t)} style={styles.input} keyboardType="numeric" />
        <TextInput
          placeholder="Observações"
          value={formData.observacoes}
          onChangeText={t => updateField('observacoes', t)}
          style={[styles.input, styles.textArea]}
          multiline
        />

        <PetPreviewCard data={formData} />

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Salvar Pet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearBtn} onPress={resetForm}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>

          {pet?.id ? (
            <TouchableOpacity style={[styles.clearBtn, styles.deleteBtn]} onPress={() => setShowDeleteConfirm(prev => !prev)}>
              <Text style={styles.clearText}>Excluir</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {showDeleteConfirm ? (
          <View style={styles.deleteConfirmCard}>
            <Text style={styles.deleteConfirmLabel}>Digite o nome do pet para confirmar exclusão:</Text>
            <TextInput placeholder="Nome do pet" value={confirmName} onChangeText={setConfirmName} style={styles.input} />

            <View style={styles.actionsRow}>
              <TouchableOpacity style={[styles.saveBtn, styles.deleteConfirmBtn]} onPress={handleDelete} disabled={confirmName !== formData.nome}>
                <Text style={styles.saveText}>Confirmar exclusão</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.clearBtn} onPress={() => { setShowDeleteConfirm(false); setConfirmName(''); }}>
                <Text style={styles.clearText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 18,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerButtonText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 56,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  input: {
    backgroundColor: Colors.surface,
    padding: 9,
    borderRadius: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 78,
    textAlignVertical: 'top',
  },
  specRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 5,
  },
  specBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  specActive: {
    backgroundColor: Colors.primaryLight,
  },
  specLabel: {
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
  clearBtn: {
    backgroundColor: Colors.background,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  clearText: {
    fontWeight: '700',
    color: Colors.primary,
  },
  deleteBtn: {
    backgroundColor: Colors.error,
  },
  deleteConfirmCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deleteConfirmLabel: {
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  deleteConfirmBtn: {
    backgroundColor: Colors.error,
  },
});
