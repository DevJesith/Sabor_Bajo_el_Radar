package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.dtos.OfertaDTO;
import com.sbr.sabor_bajo_el_radar.model.Oferta;
import com.sbr.sabor_bajo_el_radar.services.OfertaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ofertas")
public class OfertaApiController {

    @Autowired
    private OfertaService ofertaService;

    @GetMapping
    public ResponseEntity<List<Oferta>> getOfertasDelVendedor(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Oferta> ofertas = ofertaService.findAllByVendedorEmail(userDetails.getUsername());
        return ResponseEntity.ok(ofertas);
    }

    @PostMapping
    public ResponseEntity<Oferta> createOferta(@Valid @RequestBody OfertaDTO ofertaDTO, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Oferta nuevaOferta = ofertaService.save(ofertaDTO, userDetails.getUsername());
            return new ResponseEntity<>(nuevaOferta, HttpStatus.CREATED);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Oferta> updateOferta(@PathVariable Long id, @Valid @RequestBody OfertaDTO ofertaDTO, @AuthenticationPrincipal UserDetails userDetails) {
        return ofertaService.update(id, ofertaDTO, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOferta(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        boolean deleted = ofertaService.deleteByIdAndVendedorEmail(id, userDetails.getUsername());
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}