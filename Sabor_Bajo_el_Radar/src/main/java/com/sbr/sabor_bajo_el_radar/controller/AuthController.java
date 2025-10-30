package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.services.UsuarioService;
import com.sbr.sabor_bajo_el_radar.dtos.RegistroDTO;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Página de login
    @GetMapping("/login")
    public String login(
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "logout", required = false) String logout,
            @RequestParam(value = "registro", required = false) String registro,
            Model model) {

        if (error != null) {
            model.addAttribute("error", "Usuario o contraseña incorrectos");
        }
        if (logout != null) {
            model.addAttribute("mensaje", "Has cerrado sesión correctamente");
        }
        if (registro != null) {
            model.addAttribute("exito", "Registro exitoso!, ya puedes iniciar sesion");
        }
        return "Login/login";
    }

    @GetMapping("/registro")
    public String registroForm(Model model) {
        model.addAttribute("registroDTO", new RegistroDTO());
        return "Login/registro";
    }

    // Página de registro
    @PostMapping("/registro")
    public String registrarUsuario(
            @Valid @ModelAttribute("registroDTO") RegistroDTO registroDTO,
            BindingResult result,
            RedirectAttributes redirectAttributes,
            Model model) {
        if (result.hasErrors()) {
            return "Login/registro";
        }

        try {
            usuarioService.registrar(registroDTO);
            redirectAttributes.addFlashAttribute("Exito", "Registro exitoso!, ya puedes iniciar sesion");
            return "redirect:/login?reistro=exitoso";
        }catch (IllegalArgumentException e){
            model.addAttribute("error", e.getMessage());
            return "Login/registro";
        }
    }
    // Redirección después del login según rol
    @GetMapping("/home")
    public String home(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            String rol = authentication.getAuthorities().stream()
                    .findFirst()
                    .map(r -> r.getAuthority())
                    .orElse("");
            // Nota: Spring Security agrega el prefijo "ROLE_"
            return switch (rol) {
                case "ROLE_CLIENTE", "ROLE_VENDEDOR", "ROLE_DOMICILIARIO" -> "redirect:/mantenimiento";
                case "ROLE_ADMINISTRADOR" -> "redirect:/Administrador/panel_administrador/panel_administrador";
                default -> "redirect:/login";
            };
        }
        return "redirect:/login";
    }
}