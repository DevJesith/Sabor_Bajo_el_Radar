package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoFacadeLocal {
    Producto save(Producto producto);
    Optional<Producto> findById(Integer id);
    List<Producto> findAll();
    void deleteById(Integer id);

    // Método extra opcional
    List<Producto> findByCategoria(String categoria);
}
