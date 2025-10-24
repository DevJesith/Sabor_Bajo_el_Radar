//package com.sbr.sabor_bajo_el_radar.controller;
//
//import com.sbr.sabor_bajo_el_radar.model.Usuario;
//import com.sbr.sabor_bajo_el_radar.service.facadeLocal.UsuarioFacadeLocal;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Optional;
//
//@Controller
//@RequestMapping("/usuarios")
//public class UsuarioController {
//
//    @Autowired
//    private UsuarioFacadeLocal usuarioFacade;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Autowired
//    private RoleFacadeLocal rfl;
//
//
//    @GetMapping("/lista")
//    public String listar(Model model) {
//        model.addAttribute("usuarios", usuarioFacade.findAll());
//        return "Administrador/CRUD/usuarios";
//    }
//
//    @GetMapping
//    public String redirigirALista() {
//        return "redirect:/usuarios/lista";
//    }
//
//    @GetMapping("/nuevo")
//    public String nuevo(Model model) {
//        model.addAttribute("usuario", new Usuario());
//        model.addAttribute("roles", rfl.findAll());
//        return "Administrador/CRUD/usuario_form";
//    }
//
//    @GetMapping("/editar/{id}")
//    public String editar(@PathVariable Integer id, Model model) {
//        usuarioFacade.find(id).ifPresent(u -> model.addAttribute("usuario", u));
//        model.addAttribute("roles", rfl.findAll());
//        return "Administrador/CRUD/usuario_form";
//    }
//
//    @PostMapping("/guardar")
//    public String guardar(@ModelAttribute Usuario usuario) {
//        if (usuario.getId() == null) {
//            usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
//            usuarioFacade.create(usuario);
//        } else {
//            Optional<Usuario> existente = usuarioFacade.find(usuario.getId());
//            if (existente.isPresent()) {
//                Usuario original = existente.get();
//                // Si el campo está vacío, conserva la contraseña original
//                if (usuario.getContrasena() == null || usuario.getContrasena().isBlank()) {
//                    usuario.setContrasena(original.getContrasena());
//                } else {
//                    usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
//                }
//            }
//            usuarioFacade.edit(usuario);
//        }
//        return "redirect:/usuarios/lista";
//    }
//
//
//    @GetMapping("/eliminar/{id}")
//    public String eliminar(@PathVariable Integer id) {
//        usuarioFacade.remove(id);
//        return "redirect:/usuarios/lista";
//    }
//}
