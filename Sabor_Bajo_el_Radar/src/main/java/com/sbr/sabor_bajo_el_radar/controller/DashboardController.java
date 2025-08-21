package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
public class DashboardController {

    private UsuarioRepository usuarioRepository;
    public DashboardController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/api/dashboard/usuarios")
    public Map<String, Long> getUsuariosPorRol(){
        Map<String, Long> data = new HashMap<>();
        data.put("Admin", usuarioRepository.countByRol("Admin"));
        data.put("Cliente", usuarioRepository.countByRol("Cliente"));
        data.put("Vendedor", usuarioRepository.countByRol("Vendedor"));
        data.put("Domiciliario", usuarioRepository.countByRol("Domiciliario"));
        return data;

    }

}
