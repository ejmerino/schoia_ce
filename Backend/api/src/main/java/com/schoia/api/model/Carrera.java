package com.schoia.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "carreras")
public class Carrera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;

    @Column(name = "arancel_por_credito")
    private BigDecimal arancelPorCredito;

    @Column(name = "valor_matricula")
    private BigDecimal valorMatricula; // <-- LA NUEVA COLUMNA

    @Column(name = "universidad_id")
    private String universidadId;
}