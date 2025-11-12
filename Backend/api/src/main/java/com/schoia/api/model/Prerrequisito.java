package com.schoia.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "prerrequisitos")
@IdClass(PrerrequisitoId.class) // Usamos una clase para la clave primaria compuesta
public class Prerrequisito {

    @Id
    @Column(name = "materia_codigo")
    private String materiaCodigo;

    @Id
    @Column(name = "prerrequisito_codigo")
    private String prerrequisitoCodigo;
}