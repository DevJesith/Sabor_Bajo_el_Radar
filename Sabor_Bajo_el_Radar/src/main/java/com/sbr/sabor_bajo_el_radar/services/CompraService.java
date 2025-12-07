package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.dtos.PedidoRequestDTO;
import com.sbr.sabor_bajo_el_radar.model.*;
import com.sbr.sabor_bajo_el_radar.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CompraService {

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private DetalleCompraRepository detalleCompraRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private RutaRepository rutaRepository;

    @Autowired
    private DireccionRepository direccionRepository;

    @Transactional
    public void procesarPedido(PedidoRequestDTO request, String emailCliente) {
        Usuario usuario = usuarioRepository.findByCorreo(emailCliente)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Cliente cliente = clienteRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("El usuario no es un cliente registrado"));

        Direccion direccion = direccionRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Direccion no encontrada"));

        // 1. Agrupar productos por Vendedor (Negocio)
        Map<Long, List<PedidoRequestDTO.ItemPedidoDTO>> itemsPorVendedor = new HashMap<>();
        Map<Long, Vendedor> vendedoresCache = new HashMap<>();

        for (PedidoRequestDTO.ItemPedidoDTO itemDto : request.getItems()) {
            Producto producto = productoRepository.findById(itemDto.getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado" + itemDto.getId()));

            Vendedor vendedor = producto.getNegocio().getVendedor();

            itemsPorVendedor.computeIfAbsent(vendedor.getId(), k -> {
                vendedoresCache.put(vendedor.getId(), vendedor);
                return new ArrayList<>();
            }).add(itemDto);
        }

        // 2. Crear compras
        for (Map.Entry<Long, List<PedidoRequestDTO.ItemPedidoDTO>> entry : itemsPorVendedor.entrySet()) {
            Vendedor vendedor = vendedoresCache.get(entry.getKey());
            List<PedidoRequestDTO.ItemPedidoDTO> items = entry.getValue();

            Compra compra = new Compra();
            compra.setCliente(cliente);
            compra.setVendedor(vendedor);
            compra.setFecha(Instant.now());
            compra.setEstado("pendiente"); // Estado inicial
            compra.setTotal(BigDecimal.ZERO); // Se calculara abajo
            compra.setNota(request.getNote());

            Compra compraGuardada = compraRepository.save(compra);
            BigDecimal totalCompra = BigDecimal.ZERO;

            // 3. GUARDAR DETALLES
            for (PedidoRequestDTO.ItemPedidoDTO item : items) {
                Producto prod = productoRepository.findById(item.getId()).get();

                DetalleCompra detalle = new DetalleCompra();

                detalle.setCompraIdCompra(compraGuardada);
                detalle.setProducto(prod);
                detalle.setCantidad(item.getQuantity());
                detalle.setPrecioUnitario(prod.getPrecio());

                BigDecimal subtotal = prod.getPrecio().multiply(new BigDecimal(item.getQuantity()));
                detalle.setSubtotal(subtotal);

                totalCompra = totalCompra.add(subtotal);
                detalleCompraRepository.save(detalle);
            }

            // Actualizar total
            compraGuardada.setTotal(totalCompra);
            compraRepository.save(compraGuardada);

            // 4. Crear registro en ruta (logistica) con la direccion
            Ruta ruta = new Ruta();
            ruta.setCompraIdCompra(compraGuardada);
            ruta.setDireccionEntrega(direccion.getDireccion() + ", " + direccion.getBarrio());
            ruta.setEstado("pendiente");

            // Nota: El domiciliario se asigna despues, aqui queda null
            rutaRepository.save(ruta);
        }
    }

    public List<Map<String, Object>> listarPedidosCliente(String email) {
        List<Compra> compras = compraRepository.findByClienteUsuarioCorreoOrderByFechaDesc(email);
        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Compra c : compras) {
            // 1. Buscamos los detalles (productos) primero para saber de qué negocio son
            // CORREGIDO: findByCompraIdCompraId (con 'a' al final de Compra)
            List<DetalleCompra> detalles = detalleCompraRepository.findByCompraIdCompraId(c.getId());

            // 2. Extraemos el nombre del negocio del primer producto de la lista
            String nombreNegocio = "Restaurante";
            if (!detalles.isEmpty()) {
                nombreNegocio = detalles.get(0).getProducto().getNegocio().getNombreNegocio();
            }

            // 3. Armamos el DTO
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", "ORD-" + c.getId());
            dto.put("date", c.getFecha());
            dto.put("vendorName", nombreNegocio); // Nombre del negocio real
            dto.put("status", c.getEstado());
            dto.put("total", c.getTotal());

            dto.put("note", c.getNota());

            // --- NUEVO: AGREGAMOS DATOS DEL CLIENTE ---
            Usuario u = c.getCliente().getUsuario();
            dto.put("customerName", u.getNombres() + " " + u.getApellidos());
            dto.put("customerPhone", u.getTelefono());
            // -----------------------------------------

            List<Map<String, Object>> itemsDto = new ArrayList<>();
            for (DetalleCompra d : detalles) {
                itemsDto.add(Map.of(
                        "name", d.getProducto().getNombre(),
                        "quantity", d.getCantidad(),
                        "price", d.getPrecioUnitario()
                ));
            }
            dto.put("items", itemsDto);

            // Buscar direccion en Ruta
            Ruta ruta = rutaRepository.findByCompraIdCompraId(c.getId());
            if (ruta != null) {
                dto.put("deliveryAddress", ruta.getDireccionEntrega());
            }

            resultado.add(dto);
        }
        return resultado;
    }

    @Transactional
    public void cancelarPedido(Integer idCompra, String emailCliente) {
        Compra compra = compraRepository.findById(idCompra)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // 1. Validar que el pedido pertenezca al usuario
        if (!compra.getCliente().getUsuario().getCorreo().equals(emailCliente)) {
            throw new RuntimeException("No tienes permiso para cancelar este pedido");
        }

        // 2. Validar estado actual - SOLO SE PUEDE CANCELAR EN "pendiente"
        if (!"pendiente".equals(compra.getEstado())) {
            throw new RuntimeException("El pedido ya está en preparación y no puede cancelarse.");
        }

        // 3. Cancelar
        compra.setEstado("cancelado");
        compraRepository.save(compra);
    }
}