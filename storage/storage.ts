// Utilitário de persistência com AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, Atividade, Usuario } from '../types';

// Chaves do AsyncStorage (base keys)
const KEYS = {
  PETS: '@clyvo:pets', // will be suffixed with :<email>
  ATIVIDADES: '@clyvo:atividades', // will be suffixed with :<email>
  USUARIO: '@clyvo:usuario', // will be suffixed with :<email>
};

// Start with mock data as required by the project prompt
const petsMock: Pet[] = [
  {
    id: '1',
    nome: 'Thor',
    raca: 'Golden Retriever',
    especie: 'cachorro',
    idade: 4,
    peso: 28.5,
    foto: 'https://placedog.net/300/300?id=1',
    observacoes: 'Adora brincar com bola',
  },
  {
    id: '2',
    nome: 'Luna',
    raca: 'Shih Tzu',
    especie: 'cachorro',
    idade: 3,
    peso: 5.2,
    foto: 'https://placedog.net/300/300?id=2',
    observacoes: 'Alérgica a frango',
  },
];
const atividadesMock: Atividade[] = [];

// Inicializar dados na primeira execução
console.log('📦 storage.ts carregado');
export async function inicializarDados(): Promise<void> {
  try {
    // Initialize global keys if absent (keeps backward compatibility for anonymous usage)
    const petsExistentes = await AsyncStorage.getItem(KEYS.PETS);
    if (petsExistentes === null) {
      await AsyncStorage.setItem(KEYS.PETS, JSON.stringify(petsMock));
    }

    const atividadesExistentes = await AsyncStorage.getItem(KEYS.ATIVIDADES);
    if (atividadesExistentes === null) {
      await AsyncStorage.setItem(KEYS.ATIVIDADES, JSON.stringify(atividadesMock));
    }

    const usuarioExistente = await AsyncStorage.getItem(KEYS.USUARIO);
    if (usuarioExistente === null) {
      const usuario: Usuario = { nome: 'Tutor', petPrincipalCachorroId: '', petPrincipalGatoId: '' };
      await AsyncStorage.setItem(KEYS.USUARIO, JSON.stringify(usuario));
    }
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
  }
}

// Helper: email do usuário logado
async function getLoggedInEmail(): Promise<string | null> {
  try {
    const email = await AsyncStorage.getItem('@clyvo:userEmail');
    return email;
  } catch (err) {
    console.error('Erro ao obter email logado:', err);
    return null;
  }
}

// Helper: keys por usuário (se não houver email, usa a chave base)
async function petsKeyForCurrentUser(): Promise<string> {
  const email = await getLoggedInEmail();
  return email ? `${KEYS.PETS}:${email}` : KEYS.PETS;
}

async function atividadesKeyForCurrentUser(): Promise<string> {
  const email = await getLoggedInEmail();
  return email ? `${KEYS.ATIVIDADES}:${email}` : KEYS.ATIVIDADES;
}

async function usuarioKeyForCurrentUser(): Promise<string> {
  const email = await getLoggedInEmail();
  return email ? `${KEYS.USUARIO}:${email}` : KEYS.USUARIO;
}

// Retorna imagem placeholder por espécie
export function getFotoPorEspecie(especie: 'cachorro' | 'gato'): string {
  if (especie === 'gato') return 'https://placekitten.com/300/300';
  return 'https://placedog.net/300/300';
}

// ==================== PETS ====================

// Salvar lista de pets
export async function salvarPets(pets: Pet[]): Promise<void> {
  try {
    const key = await petsKeyForCurrentUser();
    await AsyncStorage.setItem(key, JSON.stringify(pets));
  } catch (error) {
    console.error('Erro ao salvar pets:', error);
  }
}

// Carregar pets
export async function carregarPets(): Promise<Pet[]> {
  try {
    const key = await petsKeyForCurrentUser();
    const dados = await AsyncStorage.getItem(key);
    // if not found and key is per-user, ensure empty array exists
    if (dados === null) {
      await AsyncStorage.setItem(key, JSON.stringify([]));
      return [];
    }
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error('Erro ao carregar pets:', error);
    return [];
  }
}

// Adicionar um novo pet
export async function adicionarPet(pet: Pet): Promise<void> {
  try {
    const pets = await carregarPets();
    pets.push(pet);
    await salvarPets(pets);
    // Se for o primeiro pet, atualiza o usuário para apontar para o pet principal
    try {
      const usuarioKey = await usuarioKeyForCurrentUser();
      const usuarioRaw = await AsyncStorage.getItem(usuarioKey);
      if (usuarioRaw) {
          const usuario = JSON.parse(usuarioRaw) as Usuario;
          if (pet.especie === 'cachorro') {
            if (!usuario.petPrincipalCachorroId) {
              usuario.petPrincipalCachorroId = pet.id;
              await AsyncStorage.setItem(usuarioKey, JSON.stringify(usuario));
            }
          } else if (pet.especie === 'gato') {
            if (!usuario.petPrincipalGatoId) {
              usuario.petPrincipalGatoId = pet.id;
              await AsyncStorage.setItem(usuarioKey, JSON.stringify(usuario));
            }
          }
        }
    } catch (err) {
      console.error('Erro ao atualizar usuário com pet principal:', err);
    }
  } catch (error) {
    console.error('Erro ao adicionar pet:', error);
  }
}

// Atualizar pet existente
export async function atualizarPet(pet: Pet): Promise<void> {
  try {
    const pets = await carregarPets();
    const idx = pets.findIndex(p => p.id === pet.id);
    if (idx !== -1) {
      pets[idx] = pet;
      await salvarPets(pets);
    } else {
      // se não existe, adiciona como novo
      pets.push(pet);
      await salvarPets(pets);
    }
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
  }
}

// Excluir pet por ID
export async function excluirPet(id: string): Promise<Pet[]> {
  try {
    const pets = await carregarPets();
    const novos = pets.filter(p => p.id !== id);
    await salvarPets(novos);
    return novos;
  } catch (error) {
    console.error('Erro ao excluir pet:', error);
    return [];
  }
}

// Buscar pet por ID
export async function buscarPetPorId(id: string): Promise<Pet | null> {
  try {
    const pets = await carregarPets();
    return pets.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Erro ao buscar pet:', error);
    return null;
  }
}

// ==================== ATIVIDADES ====================

// Salvar atividades
export async function salvarAtividades(atividades: Atividade[]): Promise<void> {
  try {
    const key = await atividadesKeyForCurrentUser();
    await AsyncStorage.setItem(key, JSON.stringify(atividades));
    console.log('✅ salvarAtividades: gravado', atividades.length, 'atividades');
  } catch (error) {
    console.error('Erro ao salvar atividades:', error);
  }
}

// Carregar atividades
export async function carregarAtividades(): Promise<Atividade[]> {
  try {
    const key = await atividadesKeyForCurrentUser();
    const dados = await AsyncStorage.getItem(key);
    console.log('📥 carregarAtividades: raw =', dados);
    if (dados === null) {
      await AsyncStorage.setItem(key, JSON.stringify([]));
      return [];
    }
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error('Erro ao carregar atividades:', error);
    return [];
  }
}

// Alternar status de atividade (concluída/pendente)
export async function alternarAtividade(id: string): Promise<Atividade[]> {
  try {
    const atividades = await carregarAtividades();
    const index = atividades.findIndex(a => a.id === id);
    if (index !== -1) {
      atividades[index].concluida = !atividades[index].concluida;
      await salvarAtividades(atividades);
    }
    return atividades;
  } catch (error) {
    console.error('Erro ao alternar atividade:', error);
    return [];
  }
}

// Adicionar atividade
export async function adicionarAtividade(atividade: Atividade): Promise<void> {
  try {
    const atividades = await carregarAtividades();
    atividades.push(atividade);
    await salvarAtividades(atividades);
  } catch (error) {
    console.error('Erro ao adicionar atividade:', error);
  }
}

// Limpa todas as atividades
export async function limparAtividades(): Promise<Atividade[]> {
  try {
    const key = await atividadesKeyForCurrentUser();
    console.log('🗑️ limparAtividades: escrevendo [] para', key);
    await AsyncStorage.setItem(key, JSON.stringify([]));
    const after = await AsyncStorage.getItem(key);
    console.log('🗑️ limparAtividades: after write raw =', after);
    // return empty array to callers for convenience
    return [];
  } catch (error) {
    console.error('Erro ao limpar atividades:', error);
    return [];
  }
}

// ==================== USUARIO ====================

// Carregar usuário
// ---- AUTH USER HANDLING ----
export interface AuthUser {
  nome: string;
  email: string;
  senha: string;
}

const USERS_KEY = '@clyvo:users';

export async function salvarUsuario(usuario: AuthUser): Promise<void> {
  try {
    const existentes = await AsyncStorage.getItem(USERS_KEY);
    const usuarios: AuthUser[] = existentes ? JSON.parse(existentes) : [];
    usuarios.push(usuario);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
    console.log('✅ salvarUsuario: usuário salvo', usuario, 'total users:', usuarios.length);
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
  }
}

export async function buscarUsuario(email: string): Promise<AuthUser | null> {
  try {
    const dados = await AsyncStorage.getItem(USERS_KEY);
    console.log('buscarUsuario: dados raw =', dados);
    if (!dados) return null;
    const usuarios: AuthUser[] = JSON.parse(dados);
    const found = usuarios.find(u => u.email === email) || null;
    console.log('buscarUsuario: pesquisando', email, '=>', found);
    return found;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

// Retorna todos os usuários salvos (útil para debug)
export async function listarUsuarios(): Promise<AuthUser[]> {
  try {
    const dados = await AsyncStorage.getItem(USERS_KEY);
    if (!dados) return [];
    const usuarios: AuthUser[] = JSON.parse(dados);
    return usuarios;
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return [];
  }
}

// Lista usuários de forma mais ampla (para debug): tenta USERS_KEY e também verifica se há um usuário único em KEYS.USUARIO
export async function listarUsuariosDetalhado(): Promise<string[]> {
  const out: string[] = [];
  try {
    const dados = await AsyncStorage.getItem(USERS_KEY);
    if (dados) {
      const usuarios: AuthUser[] = JSON.parse(dados);
      out.push(...usuarios.map(u => `usersKey: ${u.email} (${u.nome})`));
    }
    const single = await AsyncStorage.getItem(KEYS.USUARIO);
    if (single) {
      out.push(`usuario global: ${single}`);
    }
    const allKeys = await AsyncStorage.getAllKeys();
    out.push(`total keys: ${allKeys.length}`);
    return out.length ? out : ['nenhum usuário encontrado'];
  } catch (e) {
    console.error('Erro listarUsuariosDetalhado:', e);
    return [`erro: ${String(e)}`];
  }
}

// Apaga todos os usuários salvos (lista de logins)
export async function apagarTodosUsuarios(): Promise<void> {
  // função desativada por solicitação do desenvolvedor — não realiza remoção
  try {
    console.log('apagarTodosUsuarios: desativada (nenhuma ação executada)');
  } catch (error) {
    console.error('apagarTodosUsuarios (desativada) erro:', error);
  }
}

// Apaga todos os usuários e também os dados associados a cada conta (pets, atividades, usuario)
export async function apagarTodosUsuariosComDados(): Promise<string[]> {
  // função de limpeza completa desativada — retorna log curto informando desativação
  return ['apagarTodosUsuariosComDados: funcionalidade desativada pelo desenvolvedor'];
}

// ---- END AUTH ----

export async function carregarUsuario(): Promise<Usuario> {
  try {
    const key = await usuarioKeyForCurrentUser();
    const dados = await AsyncStorage.getItem(key);
    if (dados === null) {
      const usuario: Usuario = { nome: 'Tutor', petPrincipalCachorroId: '', petPrincipalGatoId: '' };
      await AsyncStorage.setItem(key, JSON.stringify(usuario));
      return usuario;
    }
    return dados ? JSON.parse(dados) : { nome: 'Tutor', petPrincipalCachorroId: '', petPrincipalGatoId: '' };
  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
    return { nome: 'Tutor', petPrincipalCachorroId: '', petPrincipalGatoId: '' };
  }
}

// Define pet principal por espécie
export async function setPetPrincipal(especie: 'cachorro' | 'gato', id: string): Promise<void> {
  try {
    const key = await usuarioKeyForCurrentUser();
    const usuarioRaw = await AsyncStorage.getItem(key);
    if (!usuarioRaw) return;
    const usuario = JSON.parse(usuarioRaw) as Usuario;
    if (especie === 'cachorro') usuario.petPrincipalCachorroId = id;
    else usuario.petPrincipalGatoId = id;
    await AsyncStorage.setItem(key, JSON.stringify(usuario));
  } catch (error) {
    console.error('Erro ao definir pet principal:', error);
  }
}
