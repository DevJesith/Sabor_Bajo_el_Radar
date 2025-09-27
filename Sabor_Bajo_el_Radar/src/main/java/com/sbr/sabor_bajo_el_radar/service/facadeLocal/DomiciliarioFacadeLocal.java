package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Domiciliario;
import java.util.List;

public interface DomiciliarioFacadeLocal {

    Domiciliario create(Domiciliario domiciliario);

    Domiciliario edit(Domiciliario domiciliario);

    void remove(Integer id);

    Domiciliario find(Integer id);

    List<Domiciliario> findAll();

    List<Domiciliario> findRange(int start, int end);

    long count();
}
