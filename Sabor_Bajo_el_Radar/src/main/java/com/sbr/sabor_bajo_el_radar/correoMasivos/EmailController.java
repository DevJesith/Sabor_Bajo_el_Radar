package com.sbr.sabor_bajo_el_radar.correoMasivos;

import com.sbr.sabor_bajo_el_radar.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/correo")
public class EmailController {

    @Autowired
    private EmailService emailService;

//    @PostMapping("/masivo")
//    public ResponseEntity<String> EnviarCorreosMasivos(@RequestBody EmailRequest request){
//        try {
//            emailService.enviarCorreosMasivos(request.getDestinatarios(), request.getTemplateId(), request.getDatosDinamicos());
//            return  ResponseEntity.ok("Correo enviados exitosamente");
//        } catch (IOException e) {
//            return  ResponseEntity.status(500).body("Error al enviar correos: " + e.getMessage());
//        }
//    }

    @PostMapping("/masivo")
    public String procesarFormulario(@RequestParam("destinatarios") String correos, @RequestParam("mensaje") String mensaje, @RequestParam("modo") String modo, Model model) {

        List<String> listaCorreos = Arrays.stream(correos.split(",")).map(String::trim).toList();


        try {

            if (modo.equals("plantilla")) {
                String templateId = "d-adb87f01be414409ab73f1e50245e824";
                Map<String, Object> datos = Map.of(
                        "nombre", "Usuarios",
                        "mensaje", mensaje,
                        "url", "https://saborbajoelradar.com"
                );
                emailService.enviarCorreosMasivos(listaCorreos, templateId, datos);
            } else {
                for (String email : listaCorreos) {
                    emailService.enviarCorreoLibre(email, "Bienvenido a Sabor Bajo el Radar", mensaje);
                }
            }

            model.addAttribute("resultado", "Correos enviados exitosamente");
        } catch (IOException e) {
            model.addAttribute("resultado", "Error al enviar Correos: " + e.getMessage());
        }

        return "principal/correoMasivo";
    }

}
