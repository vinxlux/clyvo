// Utilitário de persistência com AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, Atividade, Usuario } from '../types';

// Chaves do AsyncStorage
const KEYS = {
  PETS: '@clyvo:pets',
  ATIVIDADES: '@clyvo:atividades',
  USUARIO: '@clyvo:usuario',
};

// Dados mockados iniciais — pré-popular na primeira execução
const petsMock: Pet[] = [
  {
    id: '1',
    nome: 'Thor',
    raca: 'Golden Retriever',
    especie: 'cachorro',
    nascimento: '2020-03-15',
    peso: 28.5,
    foto: 'https://placedog.net/300/300?id=1',
    observacoes: 'Adora brincar com bola',
  },
  {
    id: '2',
    nome: 'Luna',
    raca: 'Shih Tzu',
    especie: 'cachorro',
    nascimento: '2021-07-22',
    peso: 5.2,
    foto: 'https://placedog.net/300/300?id=2',
    observacoes: 'Alérgica a frango',
  },
];

const atividadesMock: Atividade[] = [
  {
    id: '1',
    petId: '1',
    titulo: 'Caminhada matinal',
    tipo: 'exercicio',
    horario: '07:00',
    concluida: true,
    data: new Date().toISOString().split('T')[0],
  },
  {
    id: '2',
    petId: '1',
    titulo: 'Ração manhã',
    tipo: 'alimentacao',
    horario: '08:00',
    concluida: true,
    data: new Date().toISOString().split('T')[0],
  },
  {
    id: '3',
    petId: '2',
    titulo: 'Vermífugo',
    tipo: 'saude',
    horario: '10:00',
    concluida: false,
    data: new Date().toISOString().split('T')[0],
  },
  {
    id: '4',
    petId: '1',
    titulo: 'Hidratação',
    tipo: 'higiene',
    horario: '14:00',
    concluida: false,
    data: new Date().toISOString().split('T')[0],
  },
  {
    id: '5',
    petId: '2',
    titulo: 'Ração tarde',
    tipo: 'alimentacao',
    horario: '12:00',
    concluida: false,
    data: new Date().toISOString().split('T')[0],
  },
  {
    id: '6',
    petId: '1',
    titulo: 'Passeio no parque',
    tipo: 'exercicio',
    horario: '17:00',
    concluida: false,
    data: new Date().toISOString().split('T')[0],
  },
];

// Inicializar dados na primeira execução
export async function inicializarDados(): Promise<void> {
  try {
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
      const usuario: Usuario = { nome: 'Tutor', petPrincipalId: '1' };
      await AsyncStorage.setItem(KEYS.USUARIO, JSON.stringify(usuario));
    }
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
  }
}

// ==================== PETS ====================

// Salvar lista de pets
export async function salvarPets(pets: Pet[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.PETS, JSON.stringify(pets));
  } catch (error) {
    console.error('Erro ao salvar pets:', error);
  }
}

// Carregar pets
export async function carregarPets(): Promise<Pet[]> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.PETS);
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
  } catch (error) {
    console.error('Erro ao adicionar pet:', error);
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
    await AsyncStorage.setItem(KEYS.ATIVIDADES, JSON.stringify(atividades));
  } catch (error) {
    console.error('Erro ao salvar atividades:', error);
  }
}

// Carregar atividades
export async function carregarAtividades(): Promise<Atividade[]> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.ATIVIDADES);
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

// ==================== USUARIO ====================

// Carregar usuário
export async function carregarUsuario(): Promise<Usuario> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.USUARIO);
    return dados ? JSON.parse(dados) : { nome: 'Tutor', petPrincipalId: '1' };
  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
    return { nome: 'Tutor', petPrincipalId: '1' };
  }
}
