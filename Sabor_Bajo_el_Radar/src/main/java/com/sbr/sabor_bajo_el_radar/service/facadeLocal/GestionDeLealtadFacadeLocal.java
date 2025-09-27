package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.GestionDeLealtad;

import java.util.List;
import java.util.Optional;

public interface GestionDeLealtadFacadeLocal {

    GestionDeLealtad create(GestionDeLealtad gestion);

    GestionDeLealtad update(GestionDeLealtad gestion);

    void delete(Integer id);

    Optional<GestionDeLealtad> find(Integer id);

    List<GestionDeLealtad> findAll();
}
