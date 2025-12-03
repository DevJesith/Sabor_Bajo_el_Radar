package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.dtos.NegocioDTO;
import com.sbr.sabor_bajo_el_radar.model.Negocio;
import com.sbr.sabor_bajo_el_radar.services.NegocioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/negocios")
public class NegocioApiController {

    @Autowired
    private NegocioService negocioService;

    @GetMapping
    public ResponseEntity<List<Negocio>> getNegociosDelVendedor(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Negocio> negocios = negocioService.findAllByVendedorEmail(userDetails.getUsername());
        return ResponseEntity.ok(negocios);
    }

    @PostMapping
    public ResponseEntity<Negocio> createNegocio(@Valid @RequestBody NegocioDTO negocioDTO, @AuthenticationPrincipal UserDetails userDetails) {
        Negocio nuevoNegocio = negocioService.save(negocioDTO, userDetails.getUsername());
        return new ResponseEntity<>(nuevoNegocio, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Negocio> updateNegocio(@PathVariable Long id, @Valid @RequestBody NegocioDTO negocioDTO, @AuthenticationPrincipal UserDetails userDetails) {
        return negocioService.update(id, negocioDTO, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNegocio(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        boolean deleted = negocioService.deleteByIdAndVendedorEmail(id, userDetails.getUsername());
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}