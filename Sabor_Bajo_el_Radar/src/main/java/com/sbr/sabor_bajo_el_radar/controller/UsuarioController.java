package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.UsuarioFacadeLocal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioFacadeLocal usuarioFacade;

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("usuarios", usuarioFacade.findAll());
        return "Administrador/CRUD/usuarios";
    }

    @GetMapping("/nuevo")
    public String nuevo(Model model) {
        model.addAttribute("usuario", new Usuario());
        return "Administrador/CRUD/usuario_form";
    }

    @GetMapping("/editar/{id}")
    public String editar(@PathVariable Integer id, Model model) {
        usuarioFacade.find(id).ifPresent(u -> model.addAttribute("usuario", u));
        return "Administrador/CRUD/usuario_form";
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute Usuario usuario) {
        if (usuario.getId() == null) {
            usuarioFacade.create(usuario);
        } else {
            usuarioFacade.edit(usuario);
        }
        return "redirect:/usuarios";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Integer id) {
        usuarioFacade.remove(id);
        return "redirect:/usuarios";
    }
}
