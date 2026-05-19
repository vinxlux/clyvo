// Tipos e interfaces do app Clyvo

export interface Pet {
  id: string;
  nome: string;
  raca: string;
  especie: 'cachorro' | 'gato';
  nascimento: string;
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
  petPrincipalId: string;
}

// Tipo para os dados do formulário de cadastro
export interface FormDataPet {
  nome: string;
  raca: string;
  especie: 'cachorro' | 'gato';
  nascimento: string;
  peso: string;
  observacoes: string;
}
