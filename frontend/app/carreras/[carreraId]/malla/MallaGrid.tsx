// src/app/carreras/[carreraId]/malla/MallaGrid.tsx

"use client";

import { Materia, Prerrequisito } from "@/types";
import { useState, useMemo } from 'react';
import { CheckCircle, Lock } from 'lucide-react';

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
    const totales = materias.reduce((sum, materia) => sum + materia.creditos, 0);
    const aprobados = materias
      .filter(materia => materiasAprobadas.has(materia.codigo))
      .reduce((sum, materia) => sum + materia.creditos, 0);
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
  
  // ==================== LÓGICA DE CLIC ACTUALIZADA CON CASCADA ====================
  const handleMateriaClick = (codigoMateria: string) => {
    const isAprobada = materiasAprobadas.has(codigoMateria);
    
    setMateriasAprobadas(prevAprobadas => {
      const newAprobadas = new Set(prevAprobadas);

      if (isAprobada) {
        // --- Lógica de Deselección en Cascada ---
        const aDesaprobar = new Set<string>([codigoMateria]);
        let huboCambios = true;
        
        while (huboCambios) {
          huboCambios = false;
          // Buscamos materias aprobadas que dependan de las que estamos a punto de desaprobar
          newAprobadas.forEach(codigoAprobado => {
            if (aDesaprobar.has(codigoAprobado)) return; // Ya está en la lista para desaprobar

            const requisitos = prerrequisitos
              .filter(p => p.materiaCodigo === codigoAprobado)
              .map(p => p.prerrequisitoCodigo);

            if (requisitos.some(req => aDesaprobar.has(req))) {
              aDesaprobar.add(codigoAprobado);
              huboCambios = true;
            }
          });
        }
        
        // Eliminamos todas las materias afectadas
        aDesaprobar.forEach(codigo => newAprobadas.delete(codigo));
        
      } else {
        // --- Lógica de Aprobación (solo si está disponible) ---
        if (materiasDisponibles.has(codigoMateria)) {
          newAprobadas.add(codigoMateria);
        }
      }
      return newAprobadas;
    });
  };

  const handleSelectSemestre = (materiasDelSemestre: Materia[]) => {
    const codigosRelevantes = materiasDelSemestre
      .filter(materia => materiasDisponibles.has(materia.codigo) || materiasAprobadas.has(materia.codigo))
      .map(materia => materia.codigo);
    if (codigosRelevantes.length === 0) return;
    const todoSeleccionado = codigosRelevantes.every(codigo => materiasAprobadas.has(codigo));
    setMateriasAprobadas(prevAprobadas => {
      const newAprobadas = new Set(prevAprobadas);
      if (todoSeleccionado) {
        codigosRelevantes.forEach(codigo => newAprobadas.delete(codigo));
      } else {
        materiasDelSemestre
          .filter(materia => materiasDisponibles.has(materia.codigo))
          .forEach(materia => newAprobadas.add(materia.codigo));
      }
      return newAprobadas;
    });
  };

  const semestres = agruparPorSemestre(materias);
  
  return (
    <>
      <div className="px-4 md:px-8 mb-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-2 text-slate-200">
          <span className="font-bold text-base">Progreso de la Carrera</span>
          <span className="font-bold text-base">{progreso}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3.5 border border-slate-700">
          <div 
            className="bg-red-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
        <div className="text-right text-xs text-slate-400 mt-1">
          {creditosAprobados} / {creditosTotales} créditos
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-8 px-4 md:px-8">
        {Object.entries(semestres).map(([numeroSemestre, materiasDelSemestre]) => (
          <div key={numeroSemestre} className="w-[15rem] flex-shrink-0">
            <h2 
              onClick={() => handleSelectSemestre(materiasDelSemestre)}
              className="text-center text-sm font-bold text-slate-500 mb-2 tracking-widest cursor-pointer hover:text-sky-400 transition-colors"
              title="Aprobar/Desaprobar materias disponibles"
            >
              {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][parseInt(numeroSemestre) - 1]}
            </h2>
            <div className="space-y-2">
              {materiasDelSemestre.map((materia) => {
                const isAprobada = materiasAprobadas.has(materia.codigo);
                const isDisponible = materiasDisponibles.has(materia.codigo);
                const isBloqueada = !isAprobada && !isDisponible;

                let cardStateStyles = "";
                if (isAprobada) {
                  cardStateStyles = "bg-green-600/80 border-green-500 text-white";
                } else if (isDisponible) {
                  cardStateStyles = "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-sky-500 cursor-pointer";
                } else { // Bloqueada
                  cardStateStyles = "bg-slate-800/80 border-slate-700/80 text-slate-600 cursor-not-allowed opacity-60";
                }

                return (
                  <div 
                    key={materia.codigo}
                    onClick={() => handleMateriaClick(materia.codigo)}
                    className={`relative p-2 rounded-md border transition-all duration-200 ${cardStateStyles}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-xs leading-tight flex-1">{materia.nombre}</p>
                      <div className="flex-shrink-0">
                        {isAprobada && <CheckCircle className="w-4 h-4 text-white" />}
                        {isBloqueada && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{materia.creditos} Créditos</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}