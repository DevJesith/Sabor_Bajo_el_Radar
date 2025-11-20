package com.sbr.sabor_bajo_el_radar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/cargar/usuarios")
public class CargarUsuarios
{
    @PostMapping ("/CargarUsuarios")
    public ResponseEntity<?> cargarArchivo(@RequestParam("file")MultipartFile archivo)
    {
        return ResponseEntity.ok("Archivo Recibido");
    }
}
