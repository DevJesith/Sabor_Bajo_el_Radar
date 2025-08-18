package com.sbr.sabor_bajo_el_radar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class HelloController {



    @GetMapping("/index")
    public String home() {
        return "index";
    }

    @GetMapping("/hola")
    public String hola() {
        return "¡Hola! El servidor está funcionando correctamente.";
    }

    /*Reciben peticiones del navegador (como /productos) y deciden qué hacer.
    Como el recepcionista que recibe al cliente y lo dirige al área correcta.
     */
}
