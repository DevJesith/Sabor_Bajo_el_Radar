package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ClienteController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/cliente")
    public String clienteHome() {
        return "cliente/home";
    }

    @GetMapping("/carrito")
    public String carrito() {
        return "cliente/carrito/carrito-compra";
    }

    @GetMapping("/finalizar-compra")
    public String finalizarCompra() {
        return "cliente/carrito/finalizar-compra";
    }

    @GetMapping("/perfil-cliente")
    public String perfil(Model model, @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails != null) {
            try {
                Usuario usuario = usuarioService.findByCorreo(userDetails.getUsername());
                model.addAttribute("usuario", usuario);
            } catch (Exception e) {
                return "redirect:/login";
            }
        } else {
            return "redirect:/login";
        }

        return "cliente/perfil/cliente-perfil";
    }

    @GetMapping("/mis-pedidos")
    public String misPedidos() {
        return "cliente/pedidos/mis-pedidos";
    }

    @GetMapping("/favoritos")
    public String favoritos() {
        return "cliente/favoritos";
    }

    @GetMapping("/ubicacion")
    public String ubicacion() {
        return "cliente/perfil/ubicacion";
    }
}
