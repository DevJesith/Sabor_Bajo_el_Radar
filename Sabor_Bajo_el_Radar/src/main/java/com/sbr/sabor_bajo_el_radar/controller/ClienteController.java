package com.sbr.sabor_bajo_el_radar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ClienteController {

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
    public String perfil() {
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
