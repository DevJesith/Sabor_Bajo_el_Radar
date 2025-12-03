package com.sbr.sabor_bajo_el_radar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VendedorController {

    @GetMapping("/vendedor")
    public String vendedor() {
        return "vendedor/panel-vendedor";
    }
}
