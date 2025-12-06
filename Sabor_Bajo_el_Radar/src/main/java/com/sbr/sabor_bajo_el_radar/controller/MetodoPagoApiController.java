package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.dtos.MetodoPagoDTO;
import com.sbr.sabor_bajo_el_radar.model.MetodoPago;
import com.sbr.sabor_bajo_el_radar.services.MetodoPagoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metodos-pago")
public class MetodoPagoApiController {

    @Autowired
    private MetodoPagoService metodoPagoService;

    @GetMapping
    public ResponseEntity<List<MetodoPago>> listar(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(metodoPagoService.listarPorUsuario(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<?> guardar(@Valid @RequestBody MetodoPagoDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            MetodoPago nuevo = metodoPagoService.guardar(dto, userDetails.getUsername());
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            metodoPagoService.eliminar(id, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("mnesaje", "Eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
