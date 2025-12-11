package com.sbr.sabor_bajo_el_radar.controller;

import com.sbr.sabor_bajo_el_radar.model.Compra;
import com.sbr.sabor_bajo_el_radar.model.Usuario;
import com.sbr.sabor_bajo_el_radar.repository.CompraRepository;
import com.sbr.sabor_bajo_el_radar.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/pedidos")
public class PedidoController {

    private final CompraRepository compraRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoController(CompraRepository compraRepository, UsuarioRepository usuarioRepository) {
        this.compraRepository = compraRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Pendientes (en_camino)
    @GetMapping("/pendientes")
    public String listarPendientes(Model model) {
        List<Compra> pendientes = compraRepository.findByEstadoAndIgnoradoFalse("listo_Para_Entregar");
        model.addAttribute("pedidos", pendientes);
        // los pasamos al modelo con el nombre "pedidos"
        return "panel_Pedidos/Panel_Pedidos";
    }

    @GetMapping("/tus_entregas")
    public String tusEntregas(Model model, Authentication auth) {
        Usuario domiciliario = usuarioRepository.findByCorreo(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        List<Compra> entregas = compraRepository.findByEstadoAndDomiciliarioAndIgnoradoFalse("en_camino", domiciliario);
        model.addAttribute("pedidos", entregas);
        return "panel_Pedidos/tus_entregas";
    }

    // Historial (entregados)
    @GetMapping("/historial")
    public String historial(Model model) {
        List<Compra> historial = compraRepository.findByEstado("entregado");
        model.addAttribute("pedidos", historial);
        return "panel_Pedidos/historial_pedidos";
    }

    // Acción: marcar como entregado
    @PostMapping("/{id}/entregar")
    public String entregar(@PathVariable Integer id) {
        Compra compra = compraRepository.findById(id).orElseThrow();
        compra.setEstado("entregado");
        compraRepository.save(compra);
        return "redirect:/pedidos/pendientes";
    }

    @PostMapping("/{id}/aceptar")
    public String aceptarPedido(@PathVariable Integer id, Authentication auth) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada"));

        Usuario domiciliario = usuarioRepository.findByCorreo(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Solo aceptar si está pendiente
        if (!"listo_Para_Entregar".equalsIgnoreCase(compra.getEstado())) {
            return "redirect:/pedidos/pendientes?error=estado";
        }

        compra.setDomiciliario(domiciliario);
        compra.setEstado("en_camino");
        compra.setIgnorado(false);
        compraRepository.save(compra);

        // Redirigir a tus entregas
        return "redirect:/pedidos/tus_entregas";
    }


    @PostMapping("/{id}/ignorar")
    public String ignorarPedido(@PathVariable Integer id, Authentication auth) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada"));

        Usuario domiciliario = usuarioRepository.findByCorreo(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // marcar como ignorado para este domiciliario
        compra.setDomiciliario(domiciliario);
        compra.setIgnorado(true);
        compraRepository.save(compra);

        return "redirect:/pedidos/pendientes";
    }


}
