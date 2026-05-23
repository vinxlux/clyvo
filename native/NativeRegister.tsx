import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { salvarUsuario, buscarUsuario } from '../storage/storage';
import { Colors } from '../constants/colors';

export default function NativeRegister({ onRegistered, onCancel }: { onRegistered: () => void; onCancel: () => void }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function doRegister() {
    if (!email || !senha) return Alert.alert('Erro', 'Preencha email e senha');
    try {
      const existente = await buscarUsuario(email);
      if (existente) return Alert.alert('Erro', 'Já existe usuário com esse email');
      await salvarUsuario({ nome: nome || email.split('@')[0], email, senha });
      await AsyncStorage.setItem('@clyvo:loggedIn', 'true');
      await AsyncStorage.setItem('@clyvo:userEmail', email);
      onRegistered();
    } catch (e) {
      Alert.alert('Erro', 'Falha ao registrar');
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
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
  input: { width: '100%', backgroundColor: Colors.surface, padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  btn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, width: '100%', alignItems: 'center' },
});
