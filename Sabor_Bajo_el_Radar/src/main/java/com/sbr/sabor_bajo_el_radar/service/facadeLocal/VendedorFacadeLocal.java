package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Vendedor;

import java.util.List;
import java.util.Optional;

public interface VendedorFacadeLocal {

    Vendedor create(Vendedor vendedor);

    Vendedor edit(Vendedor vendedor);

    void remove(Integer id);

    Optional<Vendedor> find(Integer id);

    List<Vendedor> findAll();

    long count();
}
