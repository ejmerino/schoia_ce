package com.schoia.api.controller;

import com.schoia.api.model.Carrera;
import com.schoia.api.repository.CarreraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carreras")
public class CarreraController {

    @Autowired
    private CarreraRepository carreraRepository;

    // Endpoint para obtener carreras por el ID de la universidad
    // Ejemplo: GET /api/carreras?universidadId=ESPE
    @GetMapping
    public List<Carrera> getCarrerasPorUniversidad(@RequestParam String universidadId) {
        return carreraRepository.findByUniversidadId(universidadId);
    }
}