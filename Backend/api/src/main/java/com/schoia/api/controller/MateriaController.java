package com.schoia.api.controller;

import com.schoia.api.model.Materia;
import com.schoia.api.repository.MateriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {

    @Autowired
    private MateriaRepository materiaRepository;

    // Endpoint para obtener las materias de una carrera específica
    // Ejemplo: GET /api/materias?carreraId=13
    @GetMapping
    public List<Materia> getMateriasPorCarrera(@RequestParam Integer carreraId) {
        return materiaRepository.findByCarreraIdOrderBySemestreAsc(carreraId);
    }
}