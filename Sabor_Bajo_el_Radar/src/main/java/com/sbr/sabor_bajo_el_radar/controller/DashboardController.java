package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/// / Hace referencia que esta clase va a maneja peticiones HTTP y devolvera datos directamente, no paginas HTML
/// / Ademas combina dos cosas: @Controller que indica que es un controlador y @ResponseBody para que todos los metodos devuelvan datos formato JSON automaticamente
@RestController

// Anotacion de ruta base, siempre empezara por /api/dashboard
@RequestMapping("/api/dashboard")
public class DashboardController {

    // Inyeccion para que podamos usar sus metodos sin crear una instancia manual
    @Autowired
    private DashboardService dashboardService;

    //Se usa ResponseEntity.ok() para devolver los datos con estado de HTTP 200(OK)
    //@GetMapping define una ruta completa /api/dashboard/resumen


    //Resumen general
    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> resumenDashboard() {

        //Llama al metodo resumenDashboard() del servicio y devuelve un mapa con estadisticas generales
        return ResponseEntity.ok(dashboardService.resumenDashboard());
    }

    // 1. Usuarios por rol
    @GetMapping("/usuarios-por-rol")
    public ResponseEntity<Map<String, Long>> usuariosPorRol() {

        //Devuelve un mapa con la cantidad de usuarios por tipo de rol
        return ResponseEntity.ok(dashboardService.usuariosPorRol());
    }

    // 2. Negocios por estado y aprobación
    @GetMapping("/negocios-por-estado")
    public ResponseEntity<List<Map<String, Object>>> negociosPorEstado() {

        //Devuelve una lista de mapas con combinaciones de estado/aprobacion y su cantidad
        return ResponseEntity.ok(dashboardService.negociosPorEstadoYAprobacion());
    }

    // 3. Ventas por mes
    @GetMapping("/ventas-por-mes")
    public ResponseEntity<Map<String, Double>> ventasPorMes() {

        //Devuelve un mapa con el total vendido por cada mes
        return ResponseEntity.ok(dashboardService.ventasPorMes());
    }

    // 4. PQRS por estado
    @GetMapping("/pqrs-por-estado")
    public ResponseEntity<Map<String, Long>> pqrsPorEstado() {

        // Devuelve un mapa con la cantidad de PQRS por estado
        return ResponseEntity.ok(dashboardService.pqrsPorEstado());
    }


}
