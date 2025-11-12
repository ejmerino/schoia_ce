// ARCHIVO: frontend/src/app/universidades/[universidadId]/carreras/page.tsx

"use client"; // <-- ¡ESTO ES LO MÁS IMPORTANTE! Le dice a Next.js que este código se ejecuta en el navegador.

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Hook para leer parámetros de la URL en el cliente.
import { Carrera } from "@/types";
import Link from "next/link";

export default function CarrerasPage() {
  // 1. Usamos hooks para manejar el estado en el cliente.
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 2. Usamos el hook useParams() para obtener los parámetros de la URL.
  const params = useParams();
  const universidadId = params.universidadId as string; // Obtenemos el ID del objeto params.

  // 3. useEffect se ejecuta después de que el componente se monta en el navegador.
  useEffect(() => {
    // Si no tenemos un universidadId, no hacemos nada.
    if (!universidadId) {
      setIsLoading(false);
      setError("No se pudo obtener el ID de la universidad desde la URL.");
      return;
    }

    // Creamos una función async dentro de useEffect para poder usar await.
    const fetchCarreras = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:8080/api/carreras?universidadId=${universidadId}`);
        
        if (!res.ok) {
          throw new Error(`Error del servidor: ${res.status}`);
        }
        
        const data = await res.json();
        setCarreras(data);
        setError(null);
      } catch (err: any) {
        console.error("Error al obtener carreras:", err);
        setError(err.message || "Ocurrió un error al cargar los datos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarreras();
  }, [universidadId]); // Este array hace que el efecto se ejecute solo si universidadId cambia.

  // 4. Renderizamos diferentes cosas dependiendo del estado (cargando, error, éxito).
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
        <Link href="/universidades" className="text-2xl font-bold">ScholA+</Link>
        <span className="text-gray-400 font-mono">{universidadId || 'Cargando ID...'}</span>
      </header>
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Selecciona tu Carrera</h1>
        
        {isLoading && <p className="text-center text-gray-400">Cargando carreras...</p>}

        {error && <p className="text-center text-red-400">Error: {error}</p>}

        {!isLoading && !error && carreras.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carreras.map((carrera) => (
              <Link 
                key={carrera.id} 
                href={`/carreras/${carrera.id}/malla`}
                className="block bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-300 transform hover:-translate-y-1"
              >
                <h2 className="text-2xl font-semibold">{carrera.nombre}</h2>
                <p className="text-gray-400 mt-2">Costo Matrícula: ${carrera.valorMatricula.toFixed(2)}</p>
                <p className="text-gray-400">Costo por Crédito: ${carrera.arancelPorCredito.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && !error && carreras.length === 0 && (
          <div className="text-center">
            <p className="bg-yellow-900/50 text-yellow-300 p-4 rounded-lg">
              No se encontraron carreras para esta universidad.
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