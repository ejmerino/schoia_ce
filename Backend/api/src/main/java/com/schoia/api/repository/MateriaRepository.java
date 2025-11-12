package com.schoia.api.repository;

import com.schoia.api.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MateriaRepository extends JpaRepository<Materia, String> {
    // Método para buscar todas las materias de una carrera, ordenadas por semestre
    List<Materia> findByCarreraIdOrderBySemestreAsc(Integer carreraId);
}