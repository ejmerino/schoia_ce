package com.schoia.api.repository;

import com.schoia.api.model.Carrera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarreraRepository extends JpaRepository<Carrera, Integer> {
    // Spring Data JPA nos crea un método para buscar por universidadId
    List<Carrera> findByUniversidadId(String universidadId);
}