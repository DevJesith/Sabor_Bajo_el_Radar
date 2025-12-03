package com.sbr.sabor_bajo_el_radar.services.impl;

import com.sbr.sabor_bajo_el_radar.dtos.ProductoDTO;
import com.sbr.sabor_bajo_el_radar.model.Negocio;
import com.sbr.sabor_bajo_el_radar.model.Producto;
import com.sbr.sabor_bajo_el_radar.repository.NegocioRepository;
import com.sbr.sabor_bajo_el_radar.repository.ProductoRepository;
import com.sbr.sabor_bajo_el_radar.repository.VendedorRepository;
import com.sbr.sabor_bajo_el_radar.services.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private NegocioRepository negocioRepository;

    @Autowired
    private VendedorRepository vendedorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Producto> findAllByVendedorEmail(String email) {
        return vendedorRepository.findByUsuarioCorreo(email)
                .map(vendedor -> productoRepository.findByNegocioVendedorId(vendedor.getId()))
                .orElse(Collections.emptyList());
    }

    @Override
    @Transactional
    public Producto save(ProductoDTO productoDTO, String email) {
        Negocio negocio = negocioRepository.findById(productoDTO.getNegocioId())
                .filter(n -> n.getVendedor().getUsuario().getCorreo().equals(email))
                .orElseThrow(() -> new SecurityException("El negocio no existe o no pertenece a este vendedor."));

        Producto producto = new Producto();
        producto.setNegocio(negocio);
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setStock(productoDTO.getStock());
        producto.setCategoria(productoDTO.getCategoria());

        return productoRepository.save(producto);
    }

    @Override
    @Transactional
    public Optional<Producto> update(Long id, ProductoDTO productoDTO, String email) {
        return findByIdAndVendedorEmail(id, email)
                .map(producto -> {
                    if (!producto.getNegocio().getId().equals(productoDTO.getNegocioId())) {
                        Negocio nuevoNegocio = negocioRepository.findById(productoDTO.getNegocioId())
                                .filter(n -> n.getVendedor().getUsuario().getCorreo().equals(email))
                                .orElseThrow(() -> new SecurityException("El nuevo negocio no existe o no pertenece a este vendedor."));
                        producto.setNegocio(nuevoNegocio);
                    }

                    producto.setNombre(productoDTO.getNombre());
                    producto.setDescripcion(productoDTO.getDescripcion());
                    producto.setPrecio(productoDTO.getPrecio());
                    producto.setStock(productoDTO.getStock());
                    producto.setCategoria(productoDTO.getCategoria());

                    return productoRepository.save(producto);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Producto> findByIdAndVendedorEmail(Long id, String email) {
        return productoRepository.findById(id)
                .filter(producto -> producto.getNegocio().getVendedor().getUsuario().getCorreo().equals(email));
    }

    @Override
    @Transactional
    public boolean deleteByIdAndVendedorEmail(Long id, String email) {
        if (findByIdAndVendedorEmail(id, email).isPresent()) {
            productoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}