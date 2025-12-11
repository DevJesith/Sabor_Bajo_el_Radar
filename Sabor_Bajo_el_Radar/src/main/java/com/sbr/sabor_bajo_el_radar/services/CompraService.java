package com.sbr.sabor_bajo_el_radar.services;

import com.sbr.sabor_bajo_el_radar.dtos.PedidoRequestDTO;
import com.sbr.sabor_bajo_el_radar.model.*;
import com.sbr.sabor_bajo_el_radar.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

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

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private OfertaRepository ofertaRepository;

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
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado " + itemDto.getId()));

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
            compra.setEstado("pendiente");
            compra.setTotal(BigDecimal.ZERO);
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

                BigDecimal precioFinal = prod.getPrecio(); // Precio base por defecto

                // --- LÓGICA DE COMBOS ---
                if (item.getOfferId() != null) {
                    Oferta oferta = ofertaRepository.findById(item.getOfferId()).orElse(null);
                    if (oferta != null) {
                        // Usamos el precio del combo
                        precioFinal = oferta.getPrecioOferta();
                        // Guardamos la referencia a la oferta para saber el nombre después
                        detalle.setOferta(oferta);
                    }
                }
                // ------------------------

                detalle.setPrecioUnitario(precioFinal);
                BigDecimal subtotal = precioFinal.multiply(new BigDecimal(item.getQuantity()));
                detalle.setSubtotal(subtotal);

                totalCompra = totalCompra.add(subtotal);
                detalleCompraRepository.save(detalle);
            }

            // Actualizar total y guardar factura, ruta, etc...
            compraGuardada.setTotal(totalCompra);
            compraRepository.save(compraGuardada);

            Factura factura = new Factura();
            factura.setCompraIdCompra(compraGuardada);
            factura.setMetodoPago(request.getPaymentMethod());
            factura.setFechaPago(Instant.now());
            String codigoUnico = generarNumeroFacturaUnico(usuario.getId(), compraGuardada.getId());
            factura.setNumeroFactura(codigoUnico);
            facturaRepository.save(factura);

            Ruta ruta = new Ruta();
            ruta.setCompraIdCompra(compraGuardada);
            ruta.setDireccionEntrega(direccion.getDireccion() + ", " + direccion.getBarrio());
            ruta.setEstado("pendiente");
            rutaRepository.save(ruta);
        }
    }

    private String generarNumeroFacturaUnico(Integer userioId, Integer compraId) {

        // Ejemplo resultado: FAC-105-2458
        // Usamos el ID de compra y un timestamp corto para garantizar unicidad
        Long timestamp = System.currentTimeMillis() % 10000;
        return "FAC- " + userioId + "-" + compraId + timestamp;
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

    // --- LISTAR PEDIDOS CLIENTE ---
    public List<Map<String, Object>> listarPedidosCliente(String email) {
        List<Compra> compras = compraRepository.findByClienteUsuarioCorreoOrderByFechaDesc(email);
        return mapearComprasADTO(compras);
    }

    // --- LISTAR PEDIDOS VENDEDOR ---
    public List<Map<String, Object>> listarPedidosVendedor(String emailVendedor) {
        List<Compra> compras = compraRepository.findByVendedorUsuarioCorreoOrderByFechaDesc(emailVendedor);
        return mapearComprasADTO(compras);
    }

    // --- MÉTODO AUXILIAR PARA EVITAR REPETIR CÓDIGO ---
    private List<Map<String, Object>> mapearComprasADTO(List<Compra> compras) {
        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Compra c : compras) {
            List<DetalleCompra> detalles = detalleCompraRepository.findByCompraIdCompraId(c.getId());
            String nombreNegocio = "Restaurante";

            if (!detalles.isEmpty()) {
                nombreNegocio = detalles.get(0).getProducto().getNegocio().getNombreNegocio();
            }

            String numeroFacturaVisual = "ORD-" + c.getId();
            Optional<Factura> fac = facturaRepository.findByCompraIdCompraId(c.getId());
            String metodoPago = "Desconocido";

            if (fac.isPresent()) {
                numeroFacturaVisual = fac.get().getNumeroFactura();
                metodoPago = fac.get().getMetodoPago();
            }

            Map<String, Object> dto = new HashMap<>();
            dto.put("id", c.getId());
            dto.put("visualId", numeroFacturaVisual);
            dto.put("invoiceNumber", numeroFacturaVisual); // Compatibilidad con ambos fronts

            dto.put("date", c.getFecha());
            dto.put("status", c.getEstado());
            dto.put("total", c.getTotal());
            dto.put("note", c.getNota());
            dto.put("vendorName", nombreNegocio);
            dto.put("paymentMethod", metodoPago);

            Usuario u = c.getCliente().getUsuario();
            dto.put("clientName", u.getNombres() + " " + u.getApellidos());
            dto.put("customerName", u.getNombres() + " " + u.getApellidos()); // Compatibilidad
            dto.put("clientPhone", u.getTelefono());
            dto.put("customerPhone", u.getTelefono()); // Compatibilidad

            // Mapeo de Items (Productos)
            List<Map<String, Object>> itemsDto = new ArrayList<>();
            for (DetalleCompra d : detalles) {
                // --- LÓGICA DE NOMBRE ---
                // Si tiene oferta asociada, usamos el título de la oferta (Combo)
                // Si no, usamos el nombre del producto normal
                String nombreItem = d.getProducto().getNombre();
                if (d.getOferta() != null) {
                    nombreItem = d.getOferta().getTitulo(); // Ej: "Descuento por temporada"
                }

                itemsDto.add(Map.of(
                        "name", nombreItem,
                        "quantity", d.getCantidad(),
                        "price", d.getPrecioUnitario()
                ));
            }
            dto.put("items", itemsDto);     // Para Cliente
            dto.put("products", itemsDto);  // Para Vendedor

            Ruta ruta = rutaRepository.findByCompraIdCompraId(c.getId());
            if (ruta != null) {
                dto.put("deliveryAddress", ruta.getDireccionEntrega());
            }

            resultado.add(dto);
        }
        return resultado;
    }

    @Transactional
    public void cambiarEstadoPedidoVendedor(Integer idCompra, String nuevoEstado, String emailVendedor) {
        Compra compra = compraRepository.findById(idCompra)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (!compra.getVendedor().getUsuario().getCorreo().equals(emailVendedor)) {
            throw new RuntimeException("No tienes permiso para gestionar este pedido");
        }

        // Lógica de stock solo en pendiente → preparando
        if ("preparando".equalsIgnoreCase(nuevoEstado) && "pendiente".equalsIgnoreCase(compra.getEstado())) {
            // restar stock...
        }

        // Validar transición "listo_Para_Entregar" → "en_camino"
        if ("en_camino".equalsIgnoreCase(nuevoEstado) && !"listo_Para_Entregar".equalsIgnoreCase(compra.getEstado())) {
            throw new RuntimeException("El pedido debe estar 'listo_Para_Entregar' antes de enviarlo en camino");
        }

        compra.setEstado(nuevoEstado);
        compraRepository.save(compra);
    }
}