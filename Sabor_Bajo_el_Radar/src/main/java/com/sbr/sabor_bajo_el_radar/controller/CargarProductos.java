package com.sbr.sabor_bajo_el_radar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/cargar/productos")
public class CargarProductos
{
    @PostMapping("/CargarProductos")
    public ResponseEntity<?> cargarProductos(@RequestParam("file")MultipartFile archivo)
    {
        return ResponseEntity.ok("Archivo Recibido");
    }
}
