import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { salvarUsuario, buscarUsuario } from '../storage/storage';
import { Colors } from '../constants/colors';

export default function NativeRegister({ onRegistered, onCancel }: { onRegistered: () => void; onCancel: () => void }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function validateInputs() {
    const trimmedNome = nome.trim();
    const trimmedEmail = email.trim();
    const trimmedSenha = senha.trim();

    if (!trimmedNome) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return false;
    }

    if (!trimmedEmail) {
      Alert.alert('Erro', 'Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Erro', 'Email inválido');
      return false;
    }

    if (!trimmedSenha) {
      Alert.alert('Erro', 'Senha é obrigatória');
      return false;
    }

    if (trimmedSenha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    return true;
  }

  async function doRegister() {
    if (!validateInputs()) {
      return;
    }

    try {
      const existente = await buscarUsuario(email.trim());
      if (existente) return Alert.alert('Erro', 'Já existe usuário com esse email');
      await salvarUsuario({ nome: nome.trim(), email: email.trim(), senha: senha.trim() });
      await AsyncStorage.setItem('@clyvo:loggedIn', 'true');
      await AsyncStorage.setItem('@clyvo:userEmail', email.trim());
      onRegistered();
    } catch (e) {
      Alert.alert('Erro', 'Falha ao registrar');
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={onCancel} style={{ padding: 8 }}>
          <Text style={{ color: Colors.primary, fontWeight: '700' }}>Voltar</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>Registrar</Text>
        <View style={{ width: 56 }} />
      </View>

      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />

      <TouchableOpacity style={styles.btn} onPress={doRegister}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 72 : 24,
    paddingBottom: 16,
    justifyContent: 'flex-start',
  },
  input: { width: '100%', backgroundColor: Colors.surface, padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  btn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, width: '100%', alignItems: 'center' },
});
