package com.sbr.sabor_bajo_el_radar.correoMasivos;

import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import com.sbr.sabor_bajo_el_radar.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/correo")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UsuarioRepository urp;

    @PostMapping("/masivo")
    public String procesarFormulario(
            @RequestParam("roles") String rol,
            @RequestParam("mensaje") String mensaje,
            @RequestParam("modo") String modo,
            Model model) {

        List<Usuario> usuarios = rol.equals("todos")
                ? urp.findAll()
                : urp.findByRol(rol);

        List<String> correos = usuarios.stream()
                .map(Usuario::getCorreo)
                .filter(c -> c != null && !c.isBlank())
                .distinct()
                .toList();

        try {
            if (modo.equals("plantilla")) {
                String templateId = "d-adb87f01be414409ab73f1e50245e824";
                Map<String, Object> datos = Map.of(
                        "nombre", "Usuarios",
                        "mensaje", mensaje,
                        "url", "https://saborbajoelradar.com"
                );

                for (String email : correos) {
                    emailService.enviarCorreo(email, templateId, datos);
                }

            } else {
                for (String email : correos) {
                    emailService.enviarCorreoLibre(
                            List.of(email),
                            "Mensaje de Sabor Bajo el Radar",
                            mensaje
                    );
                }
            }

            model.addAttribute("resultado", "Se enviaron " + correos.size() + " correos.");
        } catch (IOException e) {
            model.addAttribute("resultado", "Error al enviar correos: " + e.getMessage());
        }

        return "principal/correoMasivo";
    }

    @GetMapping("/masivos")
    public String mostrarFormulario(Model model) {
        return "principal/correoMasivo";
    }


}
