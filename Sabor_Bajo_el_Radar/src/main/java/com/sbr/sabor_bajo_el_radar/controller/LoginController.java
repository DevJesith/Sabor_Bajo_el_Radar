//package com.sbr.sabor_bajo_el_radar.controller;
//
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.GetMapping;
//
//public class LoginController {
//
//    @GetMapping("/login")
//    public String login(Authentication authentication) {
//        if (authentication != null && authentication.isAuthenticated()) {
//            // Si ya está logueado, lo redirigimos según su rol
//            var roles = authentication.getAuthorities().toString();
//            if (roles.contains("ADMINISTRADOR")) {
//                return "redirect:Administrador/panel_administrador/panel_administrador";
//            } else {
//                return "redirect:/"; // cliente vuelve al inicio
//            }
//        }
//        return "login"; // si no está logueado, sí puede ver login
//    }
//
//}
