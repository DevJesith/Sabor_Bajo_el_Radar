package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.dtos.RechazoDTO;
import com.sbr.sabor_bajo_el_radar.model.Negocio;
import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import com.sbr.sabor_bajo_el_radar.services.AdminNegocioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
//@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminNegocioService adminNegocioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

//    @Autowired
//    private NegocioRepository negocioRepository;

    // ==========================================
    // VISTA: Renderiza el panel de administrador
    // ==========================================
    @GetMapping("/dashboard/admin")
    public String mostrarPanelAdmin(Model model) {
//        // Cargar todos los usuarios
//        List<Usuario> usuarios = usuarioRepository.findAll();
//        model.addAttribute("usuarios", usuarios);
//
//        // Cargar todos los negocios (ordenados por estado: pendiente primero)
//        List<Negocio> negocios = negocioRepository.findAllByOrderByAprobadoAsc();
//        model.addAttribute("negocios", negocios);
//
//        // DEBUG: Descomentar si necesitas verificar
//        System.out.println("=== Cargando panel admin ===");
//        System.out.println("Total usuarios: " + usuarios.size());
//        System.out.println("Total negocios: " + negocios.size());
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Negocio> negocios = adminNegocioService.getAllNegocios();

        model.addAttribute("usuarios", usuarios);
        model.addAttribute("negocios", negocios);

        System.out.println("=== DEBUG PANEL ADMIN ===");
//        System.out.println("Total usuarios: " + usuarios.size());
        System.out.println("Total negocios: " + negocios.size());

        negocios.forEach(n -> {
            System.out.println("ID: " + n.getId() +
                    " | Nombre: " + n.getNombreNegocio() +
                    " | Estado: " + n.getEstadoNegocio() +
                    " | Aprobado: " + n.getEstado());
        });

        return "Administrador/panel_administrador/panel_administrador";
    }

    // ==========================================
    // API REST: Aprobar negocio
    // ==========================================
    @PostMapping("/api/admin/negocios/aprobar/{id}")
    @ResponseBody
    public ResponseEntity<Negocio> aprobarNegocio(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Negocio negocioAprobado = adminNegocioService.aprobarNegocio(id, userDetails.getUsername());
        return ResponseEntity.ok(negocioAprobado);
    }

    // ==========================================
    // API REST: Rechazar negocio
    // ==========================================
    @PostMapping("/api/admin/negocios/rechazar/{id}")
    @ResponseBody
    public ResponseEntity<Negocio> rechazarNegocio(
            @PathVariable Long id,
            @Valid @RequestBody RechazoDTO rechazoDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        Negocio negocioRechazado = adminNegocioService.rechazarNegocio(
                id,
                rechazoDTO.getMotivo(),
                userDetails.getUsername()
        );
        return ResponseEntity.ok(negocioRechazado);
    }
}