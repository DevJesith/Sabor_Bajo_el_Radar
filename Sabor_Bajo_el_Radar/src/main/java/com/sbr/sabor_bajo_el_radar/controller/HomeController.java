package com.sbr.sabor_bajo_el_radar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index(){
        return "principal/index";
    }

    @GetMapping("/mapa-navegacion")
    public String mapaNavegacion(){
        return  "principal/mapa_navegacion";
    }

    @GetMapping("/terminos-y-condiciones")
    public String terminosCondiciones(){
        return  "principal/terminos_condiciones";
    }

    @GetMapping("/como-funciona")
    public String comoFunciona(){
        return  "principal/como_funciona";
    }

    @GetMapping("/correo-masivos")
    public String correoMasivos(){
        return  "principal/correoMasivo";
    }

    @GetMapping("/quienes-somos")
    public String quienesSomos(){
        return  "Quienes_Somos/Quienes_somos";
    }

    @GetMapping("/testimonios")
    public String testimonios(){return "principal/testimonio/testimonios";};



    
}
