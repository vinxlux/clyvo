// Types and interfaces for the Clyvo app

export interface Pet {
  id: string;
  nome: string;
  raca: string;
  especie: 'cachorro' | 'gato';
  idade: number; // age in years
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
  // Main pet identifiers by species (optional)
  petPrincipalCachorroId?: string;
  petPrincipalGatoId?: string;
}

// Data for the pet registration form
export interface FormDataPet {
  nome: string;
  raca: string;
  especie: 'cachorro' | 'gato';
  idade: string; // text field in the form, converted to a number when saved
  peso: string;
  observacoes: string;
}
