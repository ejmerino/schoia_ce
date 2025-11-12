package com.schoia.api.repository;

import com.schoia.api.model.Universidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversidadRepository extends JpaRepository<Universidad, String> {
    // Spring Data JPA crea la magia aquí. ¡No necesitamos escribir nada más!
    // JpaRepository<TipoDeEntidad, TipoDeLaClavePrimaria>
}