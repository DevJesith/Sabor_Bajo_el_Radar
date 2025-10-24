//package com.sbr.sabor_bajo_el_radar.controller;
//
//import com.sbr.sabor_bajo_el_radar.service.facadeLocal.CompraFacadeLocal;
//import com.sbr.sabor_bajo_el_radar.service.facadeLocal.DetalleCompraFacadeLocal;
//import com.sbr.sabor_bajo_el_radar.service.facadeLocal.DireccionFacadeLocal;
//import com.sbr.sabor_bajo_el_radar.service.facadeLocal.UsuarioFacadeLocal;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//public class DashboardController {
//
//    private final UsuarioFacadeLocal ufl;
//
//    private final CompraFacadeLocal cfl;
//
//    private final DetalleCompraFacadeLocal dfl;
//
//    private DireccionFacadeLocal direccionfl;
//
//    public DashboardController(UsuarioFacadeLocal ufl, CompraFacadeLocal cfl, DetalleCompraFacadeLocal dfl, DireccionFacadeLocal direccionfl) {
//        this.ufl = ufl;
//        this.cfl = cfl;
//        this.dfl = dfl;
//        this.direccionfl = direccionfl;
//    }
//
//    @GetMapping("/api/dashboard/usuarios")
//    public Map<String, Long> UsuariosPorRol() {
//        return ufl.contarUsuariosPorRol();
//    }
//
//    @GetMapping("/api/dashboard/ventas")
//    public Map<String, Double> VentasPorMes() {
//        int yearActual = LocalDate.now().getYear();
//        return cfl.obtenerVentasPorMes(yearActual);
//    }
//
//    @GetMapping("/api/dashboard/ingresos-categorias")
//    public Map<String, Double> getIngresosPorCategoria() {
//        return dfl.calcularIngresosPorCategoria();
//    }
//
//    @GetMapping("/api/dashboard/estado-pedidos")
//    public List<Map<String, Object>> EstadosPedidosPorPeriodo() {
//        return cfl.obtenerEstadosPorPeriodo();
//    }
//
//    @GetMapping("/api/dashboard/localidades")
//    public Map<String, Long> UsuariosPorLocalidad() {
//        return direccionfl.contarUsuariosPorLocalidad();
//    }
//
//
//}
