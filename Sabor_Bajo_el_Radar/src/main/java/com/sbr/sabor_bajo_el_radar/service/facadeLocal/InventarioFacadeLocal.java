package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Inventario;

import java.util.List;
import java.util.Optional;

public interface InventarioFacadeLocal {

    Inventario create(Inventario inventario);

    Inventario update(Inventario inventario);

    void delete(Integer id);

    Optional<Inventario> find(Integer id);

    List<Inventario> findAll();
}
