package com.sbr.sabor_bajo_el_radar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class HelloController {



    @GetMapping("/")
    public String home() {
        return "principal/index";
    }

//    @GetMapping("/dashboard")
//    public String dashboard() {
//        return "dasboardUsuarios";
//    }

    /*Reciben peticiones del navegador (como /productos) y deciden qué hacer.
    Como el recepcionista que recibe al cliente y lo dirige al área correcta.
     */
}
