package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository urp;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping({"/lista", "/"})
    public String redirirAlPanel() {
        return "redirect:/dashboard/admin";
    }

    @GetMapping
    public String redirigirALista() {
        return "redirect:usuarios/lista";
    }


    @GetMapping("/nuevo")
    public String nuevo(Model model) {
        model.addAttribute("usuario", new Usuario());
        model.addAttribute("roles", List.of("ADMINISTRADOR", "CLIENTE", "DOMICILIARIO", "VENDEDOR"));
        return "Administrador/CRUD/usuario_form";
    }

    @GetMapping("/editar/{id}")
    public String editar(@PathVariable Integer id, Model model) {
        Optional<Usuario> usuario = urp.findById(id);
        usuario.ifPresent(u -> model.addAttribute("usuario", u));
        model.addAttribute("roles", List.of("ADMINISTRADOR", "CLIENTE", "DOMICILIARIO", "VENDEDOR"));
        return "Administrador/CRUD/usuario_form";
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute Usuario usuario, RedirectAttributes redirectAttributes) {
        boolean esNuevo = usuario.getId() == null;

        if (esNuevo) {
            usuario.setFechaRegistro(LocalDate.now());
            usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        } else {
            Optional<Usuario> existente = urp.findById(usuario.getId());
            if (existente.isPresent()) {
                Usuario original = existente.get();

                usuario.setFechaRegistro(original.getFechaRegistro());
                if (usuario.getContrasena() == null || usuario.getContrasena().isBlank()) {
                    usuario.setContrasena(original.getContrasena());
                } else {
                    usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
                }
            }
        }

        usuario.setRol(usuario.getRol().toUpperCase());
        urp.save(usuario);

        String mensaje = esNuevo ? "Usuario creado exitosamente" : "Usuario actualziado exitosamente";
        redirectAttributes.addFlashAttribute("successMessage", mensaje);
        return "redirect:/dashboard/admin";

    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Integer id, RedirectAttributes redirectAttributes) {
        urp.deleteById(id);
        redirectAttributes.addFlashAttribute("successMessage", "Usuario eliminado exitosamente");
        return "redirect:/dashboard/admin";
    }


}
