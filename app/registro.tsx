// User registration screen
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { salvarUsuario, buscarUsuario } from '../storage/storage';

export default function RegistroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    try {
      console.log('Registro: tentando cadastrar', { nome, email });
      const existente = await buscarUsuario(email);
      if (existente) {
        Alert.alert('Erro', 'Já existe usuário com esse email');
        return;
      }
      await salvarUsuario({ nome, email, senha });
      console.log('Registro: cadastro realizado com sucesso para', email);
      await AsyncStorage.setItem('@clyvo:loggedIn', 'true');
      await AsyncStorage.setItem('@clyvo:userEmail', email);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
        // when expo-router context isn't available on web fallback, force reload
        window.location.reload();
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      console.error('Registro: erro ao cadastrar', e);
      Alert.alert('Erro', 'Não foi possível registrar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />
      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')} style={styles.link}>
        <Text style={styles.linkText}>Já tem conta? Fazer login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 80, paddingHorizontal: 20, backgroundColor: Colors.background },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: Colors.textPrimary },
  input: { width: '100%', backgroundColor: Colors.surface, padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  btn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, width: '100%', alignItems: 'center' },
  btnText: { color: '#ffffff', fontWeight: '700' },
  link: { marginTop: 12 },
  linkText: { color: Colors.primary, fontWeight: '600' },
});
