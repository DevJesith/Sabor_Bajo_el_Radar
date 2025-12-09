package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.services.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendedor/pedidos")
public class VendedorPedidoController {

    @Autowired
    private CompraService compraService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listarPedidos(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(compraService.listarPedidosVendedor(userDetails.getUsername()));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            String nuevoEstado = body.get("estado");
            compraService.cambiarEstadoPedidoVendedor(id, nuevoEstado, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("mensaje", "Estado actualizado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
