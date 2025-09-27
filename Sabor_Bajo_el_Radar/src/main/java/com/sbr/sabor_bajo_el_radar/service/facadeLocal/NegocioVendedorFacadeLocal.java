package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.NegocioVendedor;

import java.util.List;
import java.util.Optional;

public interface NegocioVendedorFacadeLocal {

    NegocioVendedor create(NegocioVendedor negocioVendedor);

    NegocioVendedor update(NegocioVendedor negocioVendedor);

    void delete(Integer id);

    Optional<NegocioVendedor> find(Integer id);

    List<NegocioVendedor> findAll();
}

