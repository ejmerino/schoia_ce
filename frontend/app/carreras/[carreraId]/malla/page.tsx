// ARCHIVO: frontend/src/app/carreras/[carreraId]/malla/page.tsx

"use client"; // <-- ¡LA SOLUCIÓN! Convertimos la página a Componente de Cliente.

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Materia, Prerrequisito } from "@/types";
import Link from "next/link";
import MallaGrid from "./MallaGrid"; // El componente interactivo sigue igual.

export default function MallaPage() {
  // Hooks para manejar el estado de los datos, carga y errores
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [prerrequisitos, setPrerrequisitos] = useState<Prerrequisito[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook para leer el 'carreraId' de la URL en el navegador
  const params = useParams();
  const carreraId = params.carreraId as string;

  // useEffect para buscar los datos cuando el componente se carga en el navegador
  useEffect(() => {
    if (!carreraId) {
      setError("No se pudo obtener el ID de la carrera desde la URL.");
      setIsLoading(false);
      return;
    }

    const fetchMallaData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Hacemos las dos llamadas a la API en paralelo
        const [materiasRes, prerrequisitosRes] = await Promise.all([
          fetch(`http://localhost:8080/api/materias?carreraId=${carreraId}`),
          fetch(`http://localhost:8080/api/prerrequisitos?carreraId=${carreraId}`)
        ]);

        if (!materiasRes.ok || !prerrequisitosRes.ok) {
          throw new Error("Una de las peticiones a la API falló.");
        }

        const materiasData = await materiasRes.json();
        const prerrequisitosData = await prerrequisitosRes.json();

        setMaterias(materiasData);
        setPrerrequisitos(prerrequisitosData);

      } catch (err: any) {
        console.error("Error al obtener los datos de la malla:", err);
        setError(err.message || "Ocurrió un error al cargar la malla.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMallaData();
  }, [carreraId]); // El efecto se vuelve a ejecutar si el carreraId cambia

  // Renderizamos la UI basándonos en el estado
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="p-4 md:p-8">
        <Link href="/universidades" className="text-blue-400 hover:underline">&larr; Volver a seleccionar carrera</Link>
        <h1 className="text-3xl md:text-5xl font-bold text-center mt-4">Malla Curricular Interactiva</h1>
         <p className="text-center text-gray-400 mt-2">Haz clic en las materias que ya aprobaste.</p>
      </header>

      <main className="flex-grow">
        {isLoading && <p className="text-center text-gray-400">Cargando malla...</p>}
        
        {error && <p className="text-center text-red-400">Error: {error}</p>}
        
        {!isLoading && !error && materias.length > 0 && (
          <MallaGrid materias={materias} prerrequisitos={prerrequisitos} />
        )}

        {!isLoading && !error && materias.length === 0 && (
          <p className="text-center text-yellow-400">No se encontraron materias para esta carrera.</p>
        )}
      </main>
    </div>
  );
}