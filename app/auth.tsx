import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { salvarUsuario, buscarUsuario, listarUsuarios, listarUsuariosDetalhado } from '../storage/storage';

export default function AuthScreen() {
  console.log('🔐 AuthScreen render – exibindo tela de login');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();
  // deletion feature removed
  // const [deletionLog, setDeletionLog] = useState<string[] | null>(null);
  // const [loading, setLoading] = useState(false);
  const [usersDetails, setUsersDetails] = useState<string[] | null>(null);
  const [dumpData, setDumpData] = useState<{k:string;v:string|null}[] | null>(null);

  // deleted: logging side-effect removed per user request

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setNome('');
    setEmail('');
    setSenha('');
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }
    try {
      const user = await buscarUsuario(email);
      if (!user || user.senha !== senha) {
        Alert.alert('Erro', 'Email ou senha inválidos');
        return;
      }
      await AsyncStorage.setItem('@clyvo:loggedIn', 'true');
      await AsyncStorage.setItem('@clyvo:userEmail', email);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
        window.location.reload();
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      Alert.alert('Erro', 'Falha ao verificar credenciais');
    }
  };

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    try {
      const existente = await buscarUsuario(email);
      if (existente) {
        Alert.alert('Erro', 'Já existe usuário com esse email');
        return;
      }
      await salvarUsuario({ nome, email, senha });
      await AsyncStorage.setItem('@clyvo:loggedIn', 'true');
      await AsyncStorage.setItem('@clyvo:userEmail', email);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
        window.location.reload();
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível registrar');
    }
  };

  // deletar funções de limpeza removidas

  const handleShowUsers = async () => {
    try {
      const details = await listarUsuariosDetalhado();
      const msg = details.length ? details.join('\n') : 'Nenhum usuário salvo';
      Alert.alert('Logins atuais', msg);
      console.log('listarUsuariosDetalhado:', details);
      setUsersDetails(details);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível listar usuários');
    }
  };

  const handleDumpStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const pairs = await AsyncStorage.multiGet(keys);
      const formatted = pairs.map(p => ({ k: p[0], v: p[1] }));
      setDumpData(formatted);
      console.log('dumpStorage:', formatted);
      const preview = formatted.slice(0, 20).map(f => `${f.k} => ${f.v}`).join('\n');
      Alert.alert('Storage dump (preview)', preview || 'vazio');
    } catch (e) {
      console.error('dumpStorage erro', e);
      Alert.alert('Erro', 'Falha ao ler AsyncStorage');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{mode === 'login' ? 'Entrar' : 'Cadastrar'}</Text>

      {mode === 'register' && (
        <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      )}

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />

      {mode === 'login' ? (
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Entrar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>Registrar</Text>
        </TouchableOpacity>
      )}

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>{mode === 'login' ? "Não tem conta?" : 'Já tem conta?'}</Text>
        <TouchableOpacity onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
          <Text style={styles.switchLink}>{mode === 'login' ? 'Registrar' : 'Entrar'}</Text>
        </TouchableOpacity>
      </View>
      {mode === 'login' && (
        <TouchableOpacity style={[styles.deleteBtn, { marginTop: 6 }]} onPress={handleShowUsers}>
          <Text style={{ color: Colors.primary, fontWeight: '700' }}>Ver logins</Text>
        </TouchableOpacity>
      )}
      {mode === 'login' && (
        <TouchableOpacity style={[styles.deleteBtn, { marginTop: 6 }]} onPress={handleDumpStorage}>
          <Text style={{ color: Colors.primary, fontWeight: '700' }}>Dump storage</Text>
        </TouchableOpacity>
      )}
      {usersDetails && (
        <View style={[styles.logContainer, { marginTop: 8 }]}>
          <Text style={styles.logHeader}>Logins encontrados:</Text>
          {usersDetails.map((l, i) => (
            <Text key={i} style={styles.logLine}>{l}</Text>
          ))}
        </View>
      )}
      {dumpData && (
        <View style={[styles.logContainer, { marginTop: 8 }]}>
          <Text style={styles.logHeader}>Dump storage (primeiras 50):</Text>
          <ScrollView style={{ maxHeight: 160 }}>
            {dumpData.slice(0,50).map((d, i) => (
              <Text key={i} style={styles.logLine}>{d.k}{' => '}{d.v}</Text>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => setDumpData(null)} style={styles.clearLogBtn}>
            <Text style={styles.clearLogText}>Fechar dump</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* deletion UI removed per user request */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: Colors.background },
  header: { fontSize: 26, fontWeight: '800', marginBottom: 20, color: Colors.textPrimary },
  input: { width: '100%', backgroundColor: Colors.surface, padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  btn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 10, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  switchRow: { flexDirection: 'row', marginTop: 12, gap: 8 },
  switchText: { color: Colors.textSecondary },
  switchLink: { color: Colors.primary, fontWeight: '700' },
  deleteBtn: { marginTop: 12 },
  deleteText: { color: '#d9534f', fontWeight: '700' },
  logContainer: { marginTop: 12, width: '100%', backgroundColor: Colors.surface, padding: 10, borderRadius: 8 },
  logHeader: { fontWeight: '700', marginBottom: 6 },
  logLine: { color: Colors.textSecondary, fontSize: 12 },
  logSuccess: { color: 'green', fontSize: 12, marginBottom: 4 },
  logError: { color: '#d9534f', fontSize: 12, marginBottom: 4 },
  clearLogBtn: { marginTop: 8 },
  clearLogText: { color: Colors.primary, fontWeight: '700' },
});
