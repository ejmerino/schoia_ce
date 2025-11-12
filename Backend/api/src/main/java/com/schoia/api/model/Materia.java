package com.schoia.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "materias")
public class Materia {
    @Id
    private String codigo;
    private String nombre;
    private Integer creditos;
    private String dificultad;
    private Integer semestre;

    @Column(name = "carrera_id")
    private Integer carreraId;
}