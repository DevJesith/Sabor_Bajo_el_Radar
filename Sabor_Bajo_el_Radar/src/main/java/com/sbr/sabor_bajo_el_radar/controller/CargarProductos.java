//package com.sbr.sabor_bajo_el_radar.controller;
//
//import com.sbr.sabor_bajo_el_radar.services.CargaProductoService;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.multipart.MultipartFile;
//
//@Controller
//public class CargarProductos {
//
//    private final CargaProductoService cargaProductoService;
//
//    public CargarProductos(CargaProductoService cargaProductoService) {
//        this.cargaProductoService = cargaProductoService;
//    }
//
//    @GetMapping("/productos/importar")
//    public String mostrarFormulario() {
//        return "importarProductos/importarProductos";
//    }
//
//    @PostMapping("/productos/importar")
//    public String importarArchivo(MultipartFile archivo, Model model) {
//
//        if (archivo.isEmpty()) {
//            model.addAttribute("mensaje", "Por favor seleccione un archivo.");
//            return "importarProductos/importarProductos";
//        }
//
//        var resultado = cargaProductoService.importarProductos(archivo);
//        model.addAttribute("mensaje", resultado.get("mensaje"));
//
//        return "importarProductos/importarProductos";
//    }
//}
