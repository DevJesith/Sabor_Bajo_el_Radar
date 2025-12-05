//package com.sbr.sabor_bajo_el_radar.controller;
//
//import com.sbr.sabor_bajo_el_radar.model.Usuario;
//import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//
//import java.util.List;
//
//@Controller
//@RequestMapping("/dashboard")
//public class DashboardViewController {
//
//    @Autowired
//    private UsuarioRepository usuarioRepository;
//
//    @GetMapping("/admin")
//    public String usuarios(Model model) {
//
//        List<Usuario> usuarios = usuarioRepository.findAll();
//
//        model.addAttribute("usuarios", usuarios);
//
//        return "Administrador/panel_administrador/panel_administrador";
//    }
//
//
//}
