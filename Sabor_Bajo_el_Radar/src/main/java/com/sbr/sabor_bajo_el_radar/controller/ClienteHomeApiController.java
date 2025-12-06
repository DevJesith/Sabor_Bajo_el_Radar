package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.dtos.ClienteHomeDTO;
import com.sbr.sabor_bajo_el_radar.services.ClienteHomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cliente/home")
public class ClienteHomeApiController {

    @Autowired
    private ClienteHomeService clienteHomeService;

    @GetMapping("/negocios")
    public ResponseEntity<List<ClienteHomeDTO.VendorDTO>> getNegociosParaHome() {
        return ResponseEntity.ok(clienteHomeService.obtenerNegociosActivos());
    }
}
