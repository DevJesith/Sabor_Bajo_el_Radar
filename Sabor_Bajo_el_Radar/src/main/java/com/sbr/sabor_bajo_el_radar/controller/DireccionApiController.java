package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.dtos.DireccionDTO;
import com.sbr.sabor_bajo_el_radar.services.DireccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
public class DireccionApiController {

    @Autowired
    private DireccionService direccionService;

    @GetMapping
    public ResponseEntity<List<DireccionDTO>> listar(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(direccionService.listarPorUsuario(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<DireccionDTO> guardar(@RequestBody DireccionDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(direccionService.guardar(dto, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        direccionService.eliminar(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
