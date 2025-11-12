package com.schoia.api.controller;

import com.schoia.api.model.Universidad;
import com.schoia.api.repository.UniversidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController // Le dice a Spring que esta clase define endpoints REST
@RequestMapping("/api/universidades") // La URL base para todos los endpoints en esta clase
public class UniversidadController {

    @Autowired // Spring inyectará automáticamente una instancia de nuestro repositorio
    private UniversidadRepository universidadRepository;

    @GetMapping // Este método manejará peticiones GET a /api/universidades
    public List<Universidad> getAllUniversidades() {
        return universidadRepository.findAll();
    }
}