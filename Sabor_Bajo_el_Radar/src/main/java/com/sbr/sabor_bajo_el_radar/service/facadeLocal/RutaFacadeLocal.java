package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Ruta;

import java.util.List;
import java.util.Optional;

public interface RutaFacadeLocal {

    Ruta create(Ruta ruta);

    Ruta edit(Ruta ruta);

    void remove(Integer id);

    Optional<Ruta> find(Integer id);

    List<Ruta> findAll();

    long count();
}
