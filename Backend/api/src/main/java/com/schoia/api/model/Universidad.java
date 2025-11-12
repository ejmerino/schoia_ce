package com.schoia.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data // Lombok: genera getters, setters, toString(), etc. automáticamente
@Entity // JPA: le dice a Spring que esta clase es una tabla de la BD
@Table(name = "universidades") // Especifica el nombre exacto de la tabla
public class Universidad {

    @Id // Marca este campo como la clave primaria
    private String id;

    private String nombre;
    private String pais;
    private String siglas;
}