package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.services.CargaUsuariosService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;


@Controller
public class CargarUsuarios {

    // llamamos el servicio de carga de usuario
    private final CargaUsuariosService cargaUsuariosService;

    public CargarUsuarios(CargaUsuariosService cargaUsuariosService) {
        this.cargaUsuariosService = cargaUsuariosService;
    }

    @GetMapping("/usuarios/importar")
    public String mostrarFormulario()
    {
        return "ImportarUsuarios/importarUsuarios";
    }

    @PostMapping("/usuarios/importar/procesar")
    public String importarArchivo(MultipartFile archivo, Model model)
    {

        if (archivo.isEmpty())
        {
            model.addAttribute("mensaje", "Debe seleccionar un archivo.");
            return "ImportarUsuarios/importarUsuarios";
        }

        var resulato = cargaUsuariosService.importarUsuarios(archivo);
        model.addAttribute("mensaje", resulato.get("mensaje"));

        return "ImportarUsuarios/importarUsuarios";
    }

}
