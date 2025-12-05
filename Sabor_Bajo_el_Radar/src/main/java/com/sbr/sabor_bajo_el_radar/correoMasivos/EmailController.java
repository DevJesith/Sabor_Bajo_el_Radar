package com.sbr.sabor_bajo_el_radar.correoMasivos;

import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import com.sbr.sabor_bajo_el_radar.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/correo")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UsuarioRepository urp;

    @PostMapping("/masivo")
    public RedirectView procesarFormulario(
            @RequestParam("roles") String rol,
            @RequestParam("mensaje") String mensaje,
            @RequestParam("modo") String modo,
            RedirectAttributes redirectAttributes) {

        // --- ¡CORRECCIÓN CLAVE! Volvemos a tu lógica original para obtener usuarios ---
        // Usamos 'rol' directamente, sin convertir a mayúsculas.
        List<Usuario> usuarios = "todos".equalsIgnoreCase(rol)
                ? urp.findAll()
                : urp.findByRol(rol); // <-- Cambio crucial: usamos 'rol' en minúsculas.

        List<String> correos = usuarios.stream()
                .map(Usuario::getCorreo)
                .filter(c -> c != null && !c.isBlank())
                .distinct()
                .collect(Collectors.toList());

        if (correos.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "No se encontraron destinatarios para el grupo '" + rol + "'. Revisa que el rol exista.");
            return new RedirectView("/dashboard/admin");
        }

        try {
            // --- MANTENEMOS TU LÓGICA ORIGINAL DE ENVÍO EN BUCLE ---
            if ("plantilla".equals(modo)) {
                String templateId = "d-adb87f01be414409ab73f1e50245e824";
                Map<String, Object> datos = Map.of(
                        "nombre", "Usuario",
                        "mensaje", mensaje,
                        "url", "https://saborbajoelradar.com"
                );

                for (String email : correos) {
                    emailService.enviarCorreo(email, templateId, datos);
                }

            } else { // modo "libre"
                for (String email : correos) {
                    emailService.enviarCorreoLibre(
                            List.of(email),
                            "Mensaje de Sabor Bajo el Radar",
                            mensaje
                    );
                }
            }

            redirectAttributes.addFlashAttribute("successMessage", "Se procesó el envío a " + correos.size() + " destinatarios.");

        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error al intentar enviar los correos: " + e.getMessage());
        }

        return new RedirectView("/dashboard/admin");
    }

    @GetMapping("/masivos")
    public RedirectView mostrarFormulario() {
        return new RedirectView("/dashboard/admin");
    }
}