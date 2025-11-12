// src/types/index.ts

export interface Universidad {
  id: string;
  nombre: string;
  pais: string;
  siglas: string;
}

// AÑADE ESTA NUEVA INTERFAZ
export interface Carrera {
  id: number;
  nombre: string;
  arancelPorCredito: number;
  valorMatricula: number; // <-- EL NUEVO CAMPO
  universidadId: string;
}

// src/types/index.ts
// ... (Universidad y Carrera ya están aquí)

export interface Materia {
  codigo: string;
  nombre: string;
  creditos: number;
  dificultad: string | null;
  semestre: number;
  carreraId: number;
}

// ...
export interface Prerrequisito {
  materiaCodigo: string;
  prerrequisitoCodigo: string;
}