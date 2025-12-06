package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.dtos.PerfilUpdateDTO;
import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/perfil-cliente")
public class PerfilClienteApiController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Usuario> getPerfilCliente(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            Usuario usuario = usuarioService.findByCorreo(userDetails.getUsername());
            usuario.setContrasena(null);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping
    public ResponseEntity<?> updatePerfilCliente(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody PerfilUpdateDTO updateDTO) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            Usuario usuarioActualizado = usuarioService.actualizarPerfil(userDetails.getUsername(), updateDTO);
            usuarioActualizado.setContrasena(null);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Ocurrio un error inesperado al actualizar"));
        }
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> eliminarCuenta(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            usuarioService.eliminarCuentaDefinitivamente(userDetails.getUsername());
            return ResponseEntity.ok(Map.of("mensaje", "Tu cuenta ha sido eliminada exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "No se pudo eliminar la cuenta en este momento."));
        }
    }
}
