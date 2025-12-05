//package com.sbr.sabor_bajo_el_radar.controller;
//
//import com.sbr.sabor_bajo_el_radar.dtos.RechazoDTO;
//import com.sbr.sabor_bajo_el_radar.model.Negocio;
//import com.sbr.sabor_bajo_el_radar.services.AdminNegocioService;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/admin/negocios")
//public class AdminNegocioController {
//
//    @Autowired
//    private AdminNegocioService adminNegocioService;
//
//    @PostMapping("/aprobar/{id}")
//    public ResponseEntity<Negocio> aprobarNegocio(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
//
//        Negocio negocioAprobado = adminNegocioService.aprobarNegocio(id, userDetails.getUsername());
//        return ResponseEntity.ok(negocioAprobado);
//    }
//
//    @PostMapping("/rechazar/{id}")
//    public ResponseEntity<Negocio> rechazarNegocio(@PathVariable Long id, @Valid @RequestBody RechazoDTO rechazoDTO, @AuthenticationPrincipal UserDetails userDetails) {
//        Negocio negocioRechazado = adminNegocioService.rechazarNegocio(id, rechazoDTO.getMotivo(), userDetails.getUsername());
//        return ResponseEntity.ok(negocioRechazado);
//    }
//}
