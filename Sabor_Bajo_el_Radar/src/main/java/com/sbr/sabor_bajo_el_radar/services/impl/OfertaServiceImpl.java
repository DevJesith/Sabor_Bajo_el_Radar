package com.sbr.sabor_bajo_el_radar.services.impl;

import com.sbr.sabor_bajo_el_radar.dtos.OfertaDTO;
import com.sbr.sabor_bajo_el_radar.model.Oferta;
import com.sbr.sabor_bajo_el_radar.model.Producto;
import com.sbr.sabor_bajo_el_radar.repository.OfertaRepository;
import com.sbr.sabor_bajo_el_radar.repository.ProductoRepository;
import com.sbr.sabor_bajo_el_radar.repository.VendedorRepository;
import com.sbr.sabor_bajo_el_radar.services.OfertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class OfertaServiceImpl implements OfertaService {

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private VendedorRepository vendedorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Oferta> findAllByVendedorEmail(String email) {
        return vendedorRepository.findByUsuarioCorreo(email)
                .map(vendedor -> ofertaRepository.findByProductoNegocioVendedorId(vendedor.getId()))
                .orElse(Collections.emptyList());
    }

    @Override
    @Transactional
    public Oferta save(OfertaDTO ofertaDTO, String email) {
        // Validación de seguridad: El producto debe pertenecer al vendedor autenticado.
        Producto producto = productoRepository.findById(ofertaDTO.getProductoId())
                .filter(p -> p.getNegocio().getVendedor().getUsuario().getCorreo().equals(email))
                .orElseThrow(() -> new SecurityException("El producto no existe o no pertenece a este vendedor."));

        Oferta oferta = new Oferta();
        oferta.setProducto(producto);
        oferta.setTitulo(ofertaDTO.getTitulo());
        oferta.setDescripcion(ofertaDTO.getDescripcion());
        oferta.setDescuento(ofertaDTO.getDescuento());
        oferta.setFechaInicio(ofertaDTO.getFechaInicio());
        oferta.setFechaExpiracion(ofertaDTO.getFechaExpiracion());

        return ofertaRepository.save(oferta);
    }

    @Override
    @Transactional
    public Optional<Oferta> update(Long id, OfertaDTO ofertaDTO, String email) {
        return findByIdAndVendedorEmail(id, email)
                .map(oferta -> {
                    // Opcional: Validar si el productoId cambió y si el nuevo producto también pertenece al vendedor
                    if (!oferta.getProducto().getId().equals(ofertaDTO.getProductoId())) {
                        Producto nuevoProducto = productoRepository.findById(ofertaDTO.getProductoId())
                                .filter(p -> p.getNegocio().getVendedor().getUsuario().getCorreo().equals(email))
                                .orElseThrow(() -> new SecurityException("El nuevo producto no existe o no pertenece a este vendedor."));
                        oferta.setProducto(nuevoProducto);
                    }

                    oferta.setTitulo(ofertaDTO.getTitulo());
                    oferta.setDescripcion(ofertaDTO.getDescripcion());
                    oferta.setDescuento(ofertaDTO.getDescuento());
                    oferta.setFechaInicio(ofertaDTO.getFechaInicio());
                    oferta.setFechaExpiracion(ofertaDTO.getFechaExpiracion());

                    return ofertaRepository.save(oferta);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Oferta> findByIdAndVendedorEmail(Long id, String email) {
        return ofertaRepository.findById(id)
                .filter(oferta -> oferta.getProducto().getNegocio().getVendedor().getUsuario().getCorreo().equals(email));
    }

    @Override
    @Transactional
    public boolean deleteByIdAndVendedorEmail(Long id, String email) {
        if (findByIdAndVendedorEmail(id, email).isPresent()) {
            ofertaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}