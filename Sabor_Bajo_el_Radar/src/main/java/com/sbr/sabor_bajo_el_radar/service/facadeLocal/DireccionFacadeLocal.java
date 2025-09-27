package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Direccion;
import java.util.List;

public interface DireccionFacadeLocal {

    Direccion create(Direccion direccion);

    Direccion edit(Direccion direccion);

    void remove(Integer id);

    Direccion find(Integer id);

    List<Direccion> findAll();

    List<Direccion> findRange(int start, int end);

    long count();
}
