// src/app/carreras/[carreraId]/malla/MallaGrid.tsx

"use client";

import { Materia, Prerrequisito } from "@/types";
import { useState, useMemo } from 'react';
// ==================== NUEVO: IMPORTAMOS ÍCONOS ====================
import { CheckCircle, Lock, ArrowRight } from 'lucide-react';

type MallaGridProps = {
  materias: Materia[];
  prerrequisitos: Prerrequisito[];
};

const agruparPorSemestre = (materias: Materia[]) => {
  return materias.reduce((acc, materia) => {
    const semestre = materia.semestre;
    if (!acc[semestre]) acc[semestre] = [];
    acc[semestre].push(materia);
    return acc;
  }, {} as Record<number, Materia[]>);
};

export default function MallaGrid({ materias, prerrequisitos }: MallaGridProps) {
  const [materiasAprobadas, setMateriasAprobadas] = useState<Set<string>>(new Set());

  const { creditosAprobados, creditosTotales, progreso } = useMemo(() => {
    const totales = materias.reduce((sum, m) => sum + m.creditos, 0);
    const aprobados = materias
      .filter(m => materiasAprobadas.has(m.codigo))
      .reduce((sum, m) => sum + m.creditos, 0);
    const porcentaje = totales > 0 ? Math.round((aprobados / totales) * 100) : 0;
    
    return { creditosAprobados: aprobados, creditosTotales: totales, progreso: porcentaje };
  }, [materias, materiasAprobadas]);
      
  const materiasDisponibles = useMemo(() => {
    const disponibles = new Set<string>();
    materias.forEach(materia => {
      if (materiasAprobadas.has(materia.codigo)) return;
      const requisitosDeEstaMateria = prerrequisitos
        .filter(p => p.materiaCodigo === materia.codigo)
        .map(p => p.prerrequisitoCodigo);
      if (requisitosDeEstaMateria.length === 0 || 
          requisitosDeEstaMateria.every(req => materiasAprobadas.has(req))) {
        disponibles.add(materia.codigo);
      }
    });
    return disponibles;
  }, [materias, prerrequisitos, materiasAprobadas]);
  
  const handleMateriaClick = (codigoMateria: string) => {
    const isDisponible = materiasDisponibles.has(codigoMateria);
    const isAprobada = materiasAprobadas.has(codigoMateria);
    
    if (!isDisponible && !isAprobada) return; // Lógica de bloqueo

    setMateriasAprobadas(prevAprobadas => {
      const newAprobadas = new Set(prevAprobadas);
      newAprobadas.has(codigoMateria) ? newAprobadas.delete(codigoMateria) : newAprobadas.add(codigoMateria);
      return newAprobadas;
    });
  };

  const semestres = agruparPorSemestre(materias);
  
  // ================== NUEVO: LÓGICA PARA LÍNEAS DE CONEXIÓN ==================
  // Creamos un mapa para encontrar rápidamente en qué semestre está cada materia
  const materiaASemestreMap = new Map<string, number>();
  materias.forEach(m => materiaASemestreMap.set(m.codigo, m.semestre));
  
  // =========================================================================

  return (
    <>
      <div className="px-4 md:px-8 mb-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-2 text-slate-200">
          <span className="font-bold text-lg">Progreso de la Carrera</span>
          <span className="font-bold text-lg">{progreso}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-4 border-2 border-slate-700">
          <div 
            className="bg-red-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
        <div className="text-right text-sm text-slate-400 mt-1">
          {creditosAprobados} / {creditosTotales} créditos
        </div>
      </div>

      <div className="relative flex gap-4 overflow-x-auto pb-8 px-4 md:px-8">
        {Object.entries(semestres).map(([numeroSemestre, materiasDelSemestre]) => (
          <div key={numeroSemestre} className="w-64 md:w-72 flex-shrink-0" id={`semestre-${numeroSemestre}`}>
            <h2 className="text-center text-lg font-semibold text-slate-400 mb-3 tracking-widest">
              {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][parseInt(numeroSemestre) - 1]}
            </h2>
            <div className="space-y-3">
              {materiasDelSemestre.map((materia, index) => {
                const isAprobada = materiasAprobadas.has(materia.codigo);
                const isDisponible = materiasDisponibles.has(materia.codigo);
                const isBloqueada = !isAprobada && !isDisponible;

                // ============ NUEVOS ESTILOS SUPER CLAROS ============
                let cardStateStyles = "";
                if (isAprobada) {
                  cardStateStyles = "bg-green-600 border-green-500 text-white shadow-lg shadow-green-600/20";
                } else if (isDisponible) {
                  cardStateStyles = "bg-sky-600 border-sky-500 text-white hover:bg-sky-500 cursor-pointer shadow-lg shadow-sky-600/20 animate-pulse";
                } else { // Bloqueada
                  cardStateStyles = "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-50";
                }

                return (
                  <div 
                    key={materia.codigo} 
                    id={materia.codigo}
                    onClick={() => handleMateriaClick(materia.codigo)}
                    className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${cardStateStyles}`}
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-sm leading-tight pr-2 flex-1">{materia.nombre}</p>
                      {/* ============ NUEVOS ÍCONOS DE ESTADO ============ */}
                      <div>
                        {isAprobada && <CheckCircle className="w-5 h-5 text-white" />}
                        {isBloqueada && <Lock className="w-4 h-4 text-slate-500" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{materia.creditos} Créditos</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {/* Aquí podríamos renderizar las líneas SVG si quisiéramos */}
      </div>
    </>
  );
}