package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Oferta;

import java.util.List;
import java.util.Optional;

public interface OfertaFacadeLocal {
    Oferta save(Oferta oferta);
    Optional<Oferta> findById(Integer id);
    List<Oferta> findAll();
    void deleteById(Integer id);
}
