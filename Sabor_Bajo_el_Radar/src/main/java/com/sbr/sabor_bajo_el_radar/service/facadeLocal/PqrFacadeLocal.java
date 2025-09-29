package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Pqr;

import java.util.List;
import java.util.Optional;

public interface PqrFacadeLocal {
    Pqr save(Pqr pqr);

    Optional<Pqr> findById(Integer id);

    List<Pqr> findAll();

    void deleteById(Integer id);
}
