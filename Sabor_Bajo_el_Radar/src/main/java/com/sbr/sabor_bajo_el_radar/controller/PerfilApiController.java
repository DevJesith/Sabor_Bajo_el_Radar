package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/perfil")
public class PerfilApiController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/vendedor")
    public ResponseEntity<Usuario> getPerfilVendedor(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            Usuario usuario = usuarioService.findByCorreo(userDetails.getUsername());

            if (usuario != null) {
                usuario.setContrasena(null);
                return ResponseEntity.ok(usuario);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error al obtener perfil del vendedor: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }

    }

    @DeleteMapping("/vendedor")
    public ResponseEntity<Map<String, String>> eliminarCuenta(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            usuarioService.eliminarCuentaDefinitivamente(userDetails.getUsername());
            return ResponseEntity.ok(Map.of("mensaje", "Tu cuenta ha sido eliminda exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "No se pudo eliminar la cienta en este momento"));
        }
    }
}
