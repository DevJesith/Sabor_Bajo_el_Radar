package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Factura;

import java.util.List;
import java.util.Optional;

public interface FacturaFacadeLocal {

    Factura create(Factura factura);

    Factura update(Factura factura);

    void delete(Integer id);

    Optional<Factura> find(Integer id);

    List<Factura> findAll();
}
