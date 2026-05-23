// Tipos e interfaces do app Clyvo

export interface Pet {
  id: string;
  nome: string;
  raca: string;
  especie: 'cachorro' | 'gato';
  idade: number; // idade em anos
  peso: number;
  foto: string;
  observacoes: string;
}

export interface Atividade {
  id: string;
  petId: string;
  titulo: string;
  tipo: 'exercicio' | 'alimentacao' | 'saude' | 'higiene';
  horario: string;
  concluida: boolean;
  data: string;
}

export interface Usuario {
  nome: string;
  // Identificadores de pet principal por espécie (opcionais)
  petPrincipalCachorroId?: string;
  petPrincipalGatoId?: string;
}

// Tipo para os dados do formulário de cadastro
export interface FormDataPet {
  nome: string;
  raca: string;
  especie: 'cachorro' | 'gato';
  idade: string; // campo de texto no formulário, convertido para number ao salvar
  peso: string;
  observacoes: string;
}
