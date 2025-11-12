// src/app/universidades/[universidadId]/carreras/page.tsx
import { Carrera } from "@/types";
import Link from "next/link";

// Next.js pasa los parámetros de la URL (el '[universidadId]') a través de `params`
type CarrerasPageProps = {
  params: {
    universidadId: string;
  }
}

async function getCarreras(universidadId: string): Promise<Carrera[]> {
  try {
    const res = await fetch(`http://localhost:8080/api/carreras?universidadId=${universidadId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching carreras:", error);
    return [];
  }
}

// El componente recibe las props con los parámetros
export default async function CarrerasPage({ params }: CarrerasPageProps) {
  const { universidadId } = params;
  const carreras = await getCarreras(universidadId);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
        <Link href="/universidades" className="text-2xl font-bold">ScholA+</Link>
        <span className="text-gray-400 font-mono">{universidadId}</span>
      </header>
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Selecciona tu Carrera</h1>
        
        {carreras.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carreras.map((carrera) => (
              <Link 
                key={carrera.id} 
                href={`/carreras/${carrera.id}/malla`} // La URL para la vista de la malla
                className="block bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-300 transform hover:-translate-y-1"
              >
                <h2 className="text-2xl font-semibold">{carrera.nombre}</h2>
                <p className="text-gray-400 mt-2">Costo Matrícula: ${carrera.valorMatricula.toFixed(2)}</p>
                <p className="text-gray-400">Costo por Crédito: ${carrera.arancelPorCredito.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="bg-yellow-900/50 text-yellow-300 p-4 rounded-lg">
              No se encontraron carreras para esta universidad o hubo un error al cargarlas.
            </p>
            <Link href="/universidades" className="mt-4 inline-block text-blue-400 hover:underline">
              &larr; Volver a la lista de universidades
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}