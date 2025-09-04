package com.sbr.sabor_bajo_el_radar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/dashboard")
public class DashboardViewController {

    @GetMapping("/usuarios")
    public String usuarios(){
        return "dashboard/usuarios";
    }
}
