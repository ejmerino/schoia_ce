// src/app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 text-center">
      <div className="max-w-3xl">
        <h1 className="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          ScholA+
        </h1>
        <p className="mt-4 text-xl text-gray-300">
          Tu asistente académico personal. Visualiza tu malla curricular, planifica tus semestres y sigue tu progreso de carrera de una forma intuitiva y dinámica.
        </p>
        <p className="mt-2 text-gray-400">
          Deja de adivinar qué materias puedes tomar. Con ScholA+, siempre sabrás cuál es tu siguiente paso hacia la graduación.
        </p>
        <div className="mt-10">
          <Link 
            href="/universidades" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
          >
            Comenzar a Planificar
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-8 text-gray-500">
        Creado para estudiantes, por estudiantes.
      </footer>
    </main>
  );
}