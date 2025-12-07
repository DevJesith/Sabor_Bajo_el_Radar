package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.dtos.PedidoRequestDTO;
import com.sbr.sabor_bajo_el_radar.services.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoApiController {

    @Autowired
    private CompraService compraService;

    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody PedidoRequestDTO request, @AuthenticationPrincipal UserDetails userDetails) {

        try {
            compraService.procesarPedido(request, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("mensaje", "Pedido creado exitosamente"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listarPedidos(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(compraService.listarPedidosCliente(userDetails.getUsername()));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarPedido(@PathVariable Integer id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            compraService.cancelarPedido(id, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("mensaje", "Pedido cancelado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
