// ARCHIVO: frontend/src/app/universidades/page.tsx

import { Universidad } from "@/types";
import Link from "next/link";

async function getUniversidades(): Promise<Universidad[]> {
  try {
    const res = await fetch('http://localhost:8080/api/universidades', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function UniversidadesPage() {
  const universidades = await getUniversidades();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <Link href="/" className="text-2xl font-bold">ScholA+</Link>
      </header>
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Selecciona tu Universidad</h1>
        
        {universidades.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universidades.map((uni) => (
              <Link 
                key={uni.id} 
                href={`/universidades/${uni.id}/carreras`}
                className="block bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-300 transform hover:-translate-y-1"
              >
                <h2 className="text-2xl font-semibold">{uni.nombre}</h2>
                <p className="text-gray-400 mt-2">{uni.siglas}</p>
              </Link>
            ))}
          </div>
        ) : (
           <p className="bg-red-900/50 text-red-300 p-4 rounded-lg">
            No se pudieron cargar las universidades. Asegúrate de que el backend esté funcionando.
          </p>
        )}
      </main>
    </div>
  );
}