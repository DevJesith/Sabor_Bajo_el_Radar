package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.model.Role;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DashboardController {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;

    public DashboardController(UsuarioRepository usuarioRepository, RoleRepository roleRepository) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
    }

    @GetMapping("/api/dashboard/usuarios")
    public Map<String, Long> getUsuariosPorRol() {
        Map<String, Long> data = new HashMap<>();

        Role admin = roleRepository.findByNombre("Admin");
        Role cliente = roleRepository.findByNombre("Cliente");
        Role vendedor = roleRepository.findByNombre("Vendedor");
        Role domiciliario = roleRepository.findByNombre("Domiciliario");

        data.put("Admin", usuarioRepository.countByRol(admin));
        data.put("Cliente", usuarioRepository.countByRol(cliente));
        data.put("Vendedor", usuarioRepository.countByRol(vendedor));
        data.put("Domiciliario", usuarioRepository.countByRol(domiciliario));
        return data;

    }

}
