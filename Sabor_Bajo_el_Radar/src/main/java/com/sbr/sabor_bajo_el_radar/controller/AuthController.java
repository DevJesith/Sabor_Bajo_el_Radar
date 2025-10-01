package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.RoleRepository;
import com.sbr.sabor_bajo_el_radar.services.UsuarioService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthController {

    private final UsuarioService usuarioService;
    private final RoleRepository roleRepository;

    public AuthController(UsuarioService usuarioService, RoleRepository roleRepository) {
        this.usuarioService = usuarioService;
        this.roleRepository = roleRepository;
    }

    // Página de login
    @GetMapping("/login")
    public String login(@RequestParam(value = "logout", required = false) String logout, Model model) {
        if (logout != null) {
            model.addAttribute("mensaje", "Has cerrado sesión correctamente");
        }
        return "Login/login";
    }


    // Página de registro
    @GetMapping("/registro")
    public String registroForm(Model model) {
        model.addAttribute("usuario", new Usuario());

        // PASO IMPORTANTE: pasar todos los roles al modelo
        model.addAttribute("roles", roleRepository.findAll());

        return "Login/registro";
    }

    // Procesar registro
    @PostMapping("/registro")
    public String registrarUsuario(@ModelAttribute Usuario usuario) {
        usuarioService.registrar(usuario); // registramos con el servicio
        return "redirect:/login";
    }

    // Redirección después del login según rol
    @GetMapping("/home")
    public String home(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            String rol = authentication.getAuthorities().stream()
                    .findFirst()
                    .map(r -> r.getAuthority())
                    .orElse("");
            return switch (rol) {
                case "cliente", "vendedor", "domiciliario" -> "mantenimiento/mantenimiento";
                case "admin" -> "Administrador/panel_administrador/panel_administrador";
                default -> "Login/login";
            };
        }
        return "Login/login";
    }
}
