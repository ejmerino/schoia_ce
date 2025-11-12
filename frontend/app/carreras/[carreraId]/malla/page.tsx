// src/app/carreras/[carreraId]/malla/page.tsx
import { Materia } from "@/types";
import Link from "next/link";

type MallaPageProps = {
  params: {
    carreraId: string;
  }
}

async function getMaterias(carreraId: string): Promise<Materia[]> {
  try {
    const res = await fetch(`http://localhost:8080/api/materias?carreraId=${carreraId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching materias:", error);
    return [];
  }
}

// Función para agrupar materias por semestre
const agruparPorSemestre = (materias: Materia[]) => {
  return materias.reduce((acc, materia) => {
    const semestre = materia.semestre;
    if (!acc[semestre]) {
      acc[semestre] = [];
    }
    acc[semestre].push(materia);
    return acc;
  }, {} as Record<number, Materia[]>);
};


export default async function MallaPage({ params }: MallaPageProps) {
  const { carreraId } = params;
  const materias = await getMaterias(carreraId);
  const semestres = agruparPorSemestre(materias);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <header className="mb-8">
        <Link href="/universidades" className="text-blue-400 hover:underline">&larr; Volver a seleccionar carrera</Link>
        <h1 className="text-3xl md:text-5xl font-bold text-center mt-4">Malla Curricular</h1>
      </header>

      <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-4">
        {Object.entries(semestres).map(([numeroSemestre, materiasDelSemestre]) => (
          <div key={numeroSemestre} className="w-64 bg-gray-900 p-3 rounded-lg flex-shrink-0">
            <h2 className="text-xl font-bold text-center border-b border-gray-700 pb-2 mb-3">Semestre {numeroSemestre}</h2>
            <div className="space-y-2">
              {materiasDelSemestre.map((materia) => (
                <div key={materia.codigo} className="bg-gray-800 p-3 rounded-md cursor-pointer hover:bg-blue-900/50">
                  <p className="font-semibold text-sm">{materia.nombre}</p>
                  <p className="text-xs text-gray-400">{materia.creditos} créditos</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}